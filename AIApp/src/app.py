from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from starlette.status import HTTP_403_FORBIDDEN
from pydantic import BaseModel
import os

app = FastAPI()

# Define the API key header
api_key_header = APIKeyHeader(name = "X-API-KEY")

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