from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
import mysql.connector
import datetime

app = FastAPI()


database_connection = mysql.connector.connect(
    host= "tc.crc.global",
    user= "maae",
    password= "APykdhWtp%@F2xrT",
    database= "dockschedule",)
cursor = database_connection.cursor()
  
origins = [
    "http://localhost:3000",
    "localhost:3000"
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
        query = ("SELECT bol, scheduledate, sendtodoorts, arrivedts, podsignrequests," 
                "departedts, podsigned, driverphone FROM schedule "
                "WHERE scheduledate BETWEEN %s AND %s ")
        cursor.execute(query, (startDate, endDate))
        
        data = []
        for (bol, scheduledate, sendtodoorts, arrivedts, podsignrequests, departedts, podsigned, driverphone) in cursor:
            data.append({
            "bol": bol,
            "scheduledate": scheduledate,
            "sendtodoorts": sendtodoorts,
            "arrivedts": arrivedts,
            "podsignrequests": podsignrequests,
            "departedts": departedts,
            "podsigned": podsigned,
            "driverphone": driverphone
            })
        return {"data": data}
    except RequestValidationError as exc:
        return {"error": exc}
   