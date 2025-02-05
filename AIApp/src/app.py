from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}

'''
class PredictionInput(BaseModel):
    # Define your input fields here
    field1: int
    field2: float
    field3: str

@app.post("/predict/")
async def predict(input: PredictionInput):
    # Implement your prediction logic here
    result = f"Received input: {input}"
    return {"prediction": result}

'''