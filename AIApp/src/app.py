'''
curl -X POST "http://3.72.247.90:8000/inference/" \
  -H "Content-Type: application/json" \
  -H "Auth: your-secure-api-key" \
  -d @sample.json

curl -X GET "http://3.72.247.90:8000" \
  -H "Auth: your-secure-api-key" \
'''

from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from starlette.status import HTTP_403_FORBIDDEN
from pydantic import BaseModel
from typing import Union, List
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

# Status endpoint
@app.get("/status/", dependencies=[Depends(validate_api_key)])
async def get_status():
    return {"status": "Healthy", "message": "API is running fine."}

class IngredientDetails(BaseModel):
    Name: str
    Quantity: Union[float, int]
    Unit: str

class Input(BaseModel):
    Ingredients: List[IngredientDetails]
    SystemPrompt: str
    UserPrompt: str

@app.post("/inference/", dependencies = [Depends(validate_api_key)])
async def predict(input: Input):
    # Implement your prediction logic here
    Ings = "\n".join([f"{x.Name}: {x.Quantity} {x.Unit}" for x in input.Ingredients])
    result = f"""Received the Following Ingredients: {Ings} SystemPrompt: {input.SystemPrompt} UserPrompt: {input.UserPrompt}
    """
    return {"prediction": result}