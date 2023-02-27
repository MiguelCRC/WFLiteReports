from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from decouple import config
import mysql.connector
import datetime

app = FastAPI()


database_connection = mysql.connector.connect(
    host= config('DB_HOST'),
    user= config('DB_USERNAME'),
    password= config('DB_PASSWORD'),
    database= config('DB_NAME'))
cursor = database_connection.cursor()
  
origins = [
    config('ORIGIN_1'),
    config('ORIGIN_2')
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

@app.get("/inbounds", tags=["inbounds"])
async def report_inbound(
    startDate: str = datetime.date.today(), 
    endDate: str = datetime.date.today()) -> dict:
    database_connection.ping(reconnect=True)
    try:
        query = (config('QUERY_INBOUND'))
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
    startDate: str= datetime.date.today(), 
    endDate: str= datetime.date.today) -> dict:
    database_connection.ping(reconnect=True)
    try:
        query = (config('QUERY_SCANNING'))
        cursor.execute(query,  (startDate, endDate))
        data = []
        for(bol, full_name, arrivedts, tplroll, whenclosed, facilityName) in cursor:
            data.append({
                "bol":bol,
                "fullName": full_name,
                "arrivedts": arrivedts,
                "tplroll": tplroll,
                "whenclosed": whenclosed,
                "facilityName": facilityName
            })
        return {"data": data}
    except RequestValidationError as exc:
        return {"error": exc}
   