from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from decouple import config
import mysql.connector
from datetime import *
import httpx

app = FastAPI()


database_connection = mysql.connector.connect(
    host=config('DB_HOST'),
    user=config('DB_USERNAME'),
    password=config('DB_PASSWORD'),
    database=config('DB_NAME'))
cursor = database_connection.cursor()

origins = [
    '*'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to WF API."}


@app.get("/esignature", tags=["esignature"])
async def report_inbound(
        startDate: str = datetime.date,
        endDate: str = datetime.date) -> dict:
    database_connection.ping(reconnect=True)
    try:
        query = (config('QUERY_ESIGNATURE'))
        cursor.execute(query, (startDate, endDate))

        data = []
        for (bol, scheduledate, sendtodoorts, arrivedts, podsignrequests, departedts, podsigned, facilityName, driverphone) in cursor:
            data.append({
                "bol": bol,
                "scheduledate": scheduledate,
                "sendtodoorts": sendtodoorts,
                "arrivedts": arrivedts,
                "podsignrequests": podsignrequests,
                "departedts": departedts,
                "podsigned": podsigned,
                "facilityName": facilityName,
                "driverphone": driverphone
            })
        return {"data": data}
    except RequestValidationError as exc:
        return {"error": exc}


@app.get("/scanning", tags=["scanning"])
async def report_scanning(
        startDate: str = datetime.date,
        endDate: str = datetime.date) -> dict:
    try:
        token =  get_tplToken()
        headers = {
            'Host': config('TPL_HOST'),
            'Connection': 'keep-alive',
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json',
            'Authorization': token,
            'Accept-Encoding': 'gzip,deflate,sdch',
            'Accept-Language': 'en-US,en;q=0.8'
        }
        users = get_tplUsers(headers)
        facilities = get_tplFacilities(headers)
        data=[]
        for warehouse in facilities:
            whId = warehouse['FacilityId']
            if not warehouse['Deactivated']:
                tplInbounds = (httpx.get(f"https://{config('TPL_HOST')}/inventory/receivers?pgsiz=500&rql=ReadOnly.FacilityIdentifier.id=={whId};ReadOnly.Status==1;arrivalDate=ge={startDate};arrivalDate=lt={endDate}", headers=headers, timeout=None)).json()
                for inbound in tplInbounds["ResourceList"]:
                    data.append({
                        "bol": inbound.get('PoNum',''),
                        "arrivedts": inbound.get("ArrivalDate",None),
                        "fullName": inbound['ReadOnly']['LastModifiedByIdentifier']['Name'],
                        "customer": inbound['ReadOnly']['CustomerIdentifier']['Name'],
                        "tplRoll":users[inbound['ReadOnly']['LastModifiedByIdentifier']['Id']],
                        "facilityName": inbound['ReadOnly']['FacilityIdentifier']['Name']
                    })
        return {"data": data}
    except RequestValidationError as exc:
        return {"error": exc}
    
@app.get("/timeSite", tags=["timeSites"])
async def report_siteTime(direction: str='Outbound',startDate: str=datetime.date, endDate: str=datetime.date) -> dict:
    database_connection.ping(reconnect=True)
    warehouseId=0
    data=[]
    for id in range (1,20):
        warehouseId=id
        try:
            query=(config('QUERY_TIMESITE'))
            cursor.execute(query,(warehouseId,direction,warehouseId,startDate,endDate,))
            for(warehouse, bol, longTime) in cursor:
                if(longTime):
                    hours = int(longTime/3600)
                    minutes = ((longTime/3600)*60) % 60
                    seconds = ((longTime/3600)*3600) % 60
                data.append({"warehouse": warehouse, "bol": bol, "LongTime": "%02d:%02d:%02d" % (hours, minutes, seconds)})
        except RequestValidationError as exc:
            return {"error": exc}
    return {"data": data}
        

@app.get("/avgTime", tags=["avgTime"])
async def report_avgTime(direction: str='Outbound', startDate: str=datetime.date, endDate: str=datetime.date)-> dict:
    database_connection.ping(reconnect=True)
    warehouseId=0
    data=[]
    for id in range(1,20):
        try:
            warehouseId=id
            query=(config('QUERY_AVGTIME'))
            cursor.execute(query,(warehouseId,direction,warehouseId,startDate,endDate,))
            for(warehouse, avgTime) in cursor:
                if(avgTime):
                    hours = int(avgTime/3600)
                    minutes = ((avgTime/3600)*60) % 60
                    seconds = ((avgTime/3600)*3600) % 60
                    data.append({"warehouse": warehouse, "AvgTime": "%02d:%02d:%02d" % (hours, minutes, seconds)})
        except RequestValidationError as exc:
            return {"error": exc}
    return {"data": data}

@app.get("/ediTracking", tags=["ediTracking"])
async def report_ediTracking(startMonth: str=datetime.date, endMonth: str=datetime.date, customerId: int=47)->dict:
    database_connection.ping(reconnect=True)
    i=1
    dataObject={}
    data=[]
    try:
        token =  get_tplToken()
        headers = {
            'Host': config('TPL_HOST'),
            'Connection': 'keep-alive',
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json',
            'Authorization': token,
            'Accept-Encoding': 'gzip,deflate,sdch',
            'Accept-Language': 'en-US,en;q=0.8'
        }
        tplEdiApp = (httpx.get(f"https://{config('TPL_HOST')}/inventory/receivers?pgsiz=500&detail=All&rql=ReadOnly.CustomerIdentifier.id=={customerId};ReadOnly.CreationDate=gt={startMonth};ReadOnly.CreationDate=lt={endMonth}",headers=headers, timeout=None)).json()
        for tplLoad in tplEdiApp['ResourceList']:
            if(len(tplLoad['SavedElements']) > 0):                
                dataObject['bol']=tplLoad['ReferenceNum']
                for element in tplLoad['SavedElements']:
                    dataObject[element["Name"]]=element["Value"]
                data.append(dataObject)
                dataObject={}
        return {"data": data}
    except RequestValidationError as exc:
        return {"error": exc}

def get_tplToken():
    headers = {
        'Host': config('TPL_HOST'),
        'Connection': 'keep-alive',
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
        'Authorization': config('TPL_AUTHORIZATION'),
        'Accept-Encoding': 'gzip,deflate,sdch',
        'Accept-Language': 'en-US,en;q=0.8'
        }
    try:
        response = ( httpx.post(config('TPL_URL'), headers=headers, data=config('TPL_PAYLOAD'))).json()
        return (response["token_type"]+" "+response["access_token"])
    except RequestValidationError as exc:
        return {"error": exc}
    

def get_tplUsers(headers):
    i=1
    userRolDict={}
    while i:
        try:
            response = (httpx.get(f"https://{config('TPL_HOST')}/uiproperties/users?pgnum={i}", headers = headers)).json()
            if(response["ResourceList"]):
                i=i+1  
            else:
                break
        except RequestValidationError as exc:
            return {"error": exc}
    
        for tplUser in response["ResourceList"]:
            if(tplUser["UiRoleIdentifiers"] and tplUser["FacilityIdentifiers"]):
                userRolDict[tplUser["UserId"]]=tplUser["UiRoleIdentifiers"][0]["Name"]
                
    return (userRolDict)

def get_tplFacilities(headers):
    try:
        facilityDict = (httpx.get(f"https://{config('TPL_HOST')}/properties/facilities", headers=headers, timeout=None)).json()
        return facilityDict["ResourceList"]
    except RequestValidationError as exc:
        return {"error": exc}
