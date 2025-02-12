'''
curl -X POST "http://3.72.247.90:8000/predict/" \
  -H "Content-Type: application/json" \
  -H "Auth: your-secure-api-key" \
  -d '{"field1": 1, "field2": 3.14, "field3": "example"}'
  -d @data.json

curl -X GET "http://3.72.247.90:8000" \
  -H "Auth: your-secure-api-key" \
'''

'''
import datetime

app = FastAPI()

# Define the API key header
api_key_header = APIKeyHeader(name="Auth")

# Retrieve the actual API key from an environment variable
VALID_API_KEY = os.environ.get("ACTUAL_API_KEY")

def validate_api_key(api_key: str = Security(api_key_header)):
    if not api_key:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, detail="Please Provide an API Key!!"
        )
    if api_key != VALID_API_KEY:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, detail="Could not validate credentials"
        )

# Capture the time when the API starts to calculate uptime.
start_time = datetime.datetime.now()

# A dummy health check for a dependent service (e.g., a database)
def check_database():
    # Replace this with real database connectivity logic.
    # For now, we assume the database is always healthy.
    return True

# Health check endpoint that provides more detailed status information.
@app.get("/health", dependencies=[Depends(validate_api_key)])
async def health():
    uptime = datetime.datetime.now() - start_time
    db_status = "healthy" if check_database() else "unhealthy"
    return {
        "status": "healthy",
        "uptime": str(uptime),
        "dependencies": {
            "database": db_status,
        },
        "message": "API and all dependencies are operational."
    }
'''

from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from starlette.status import HTTP_403_FORBIDDEN
from pydantic import BaseModel
import os

app = FastAPI()

# Define the API key header
api_key_header = APIKeyHeader(name = "Auth")

# List of valid API keys (in a real application, store these securely)
# VALID_API_KEYS = {"mattbelcher", "aaserravalle"}

VALID_API_KEY = os.environ.get("ACTUAL_API_KEY")

def validate_api_key(api_key: str = Security(api_key_header)):
    if api_key is None:
        raise HTTPException(
            status_code = HTTP_403_FORBIDDEN, detail = "Please Provide an API Key!!"
        )

    elif api_key != VALID_API_KEY:
        raise HTTPException(
            status_code = HTTP_403_FORBIDDEN, detail = "Could not validate credentials"
        )

@app.get("/", dependencies = [Depends(validate_api_key)])
async def read_root():
    return {"message": "Hello, World!"}
class PredictionInput(BaseModel):
    field1: int
    field2: float
    field3: str

@app.post("/predict/", dependencies = [Depends(validate_api_key)])
async def predict(input: PredictionInput):
    # Implement your prediction logic here
    result = f"Received input: {input}"
    return {"prediction": result}