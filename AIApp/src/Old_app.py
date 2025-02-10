'''
curl -X POST "http://127.0.0.1:8000/predict/" \
  -H "Content-Type: application/json" \
  -d '{"field1": 1, "field2": 3.14, "field3": "example"}'

{
  "prediction": "Received input: <PredictionInput(field1=1, field2=3.14, field3='example')>"
}
'''

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}

class PredictionInput(BaseModel):
    field1: int
    field2: float
    field3: str

@app.post("/predict/")
async def predict(input: PredictionInput):
    # Implement your prediction logic here
    result = f"Received input: {input}"
    return {"prediction": result}