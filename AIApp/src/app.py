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
from typing import Union, Optional, Dict, List
from langchain_google_genai import ChatGoogleGenerativeAI
# More Langchian Packages
from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, AIMessagePromptTemplate
import os
from datetime import datetime

app = FastAPI()

# Define the API key header
api_key_header = APIKeyHeader(name = "Auth")

# VALID_API_KEYS = {"mattbelcher", "aaserravalle"}

VALID_API_KEY = os.environ.get("ACTUAL_API_KEY")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

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
    return {"message": "Welcome to the Alfredo AI API Endpoint, the Available Routes are: /status/ /mirror/ /inference/ "}

# Status endpoint
@app.get("/status/", dependencies = [Depends(validate_api_key)])
async def get_status():
    return {"status": "Healthy", "message": "API is Up and Running.", "timestamp": datetime.now().isoformat()}

class IngredientDetails(BaseModel):
    Name: str
    Quantity: Union[float, int]
    Unit: str

class Input(BaseModel):
    Ingredients: List[IngredientDetails]
    SystemPrompt: Optional[str] = None
    Interactions: List[Dict[str, str]] = {}

'''
@app.post("/mirror/", dependencies = [Depends(validate_api_key)])
async def ReturnInputs(input: Input):
    # Implement your prediction logic here
    Ings = "\n".join([f"{x.Name}: {x.Quantity} {x.Unit}" for x in input.Ingredients])
    systemPrompt = input.SystemPrompt if input.SystemPrompt else "Default System Prompt"
    interactionsString = "\n".join(f"{Persona}: {Prompt}" for interaction in input.Interactions for Persona, Prompt in interaction.items())
    Result = f"""Received the Following Ingredients: {Ings}
    SystemPrompt: {systemPrompt}
    Interactions: {interactionsString}
    """
    return {"Prediction": Result}
'''

@app.post("/mirror/", dependencies = [Depends(validate_api_key)])
async def ReturnInputs(input: Input):
    Ings = []
    for x in input.Ingredients:
        Ings.append({"Name": x.Name, "Quantity": x.Quantity, "Unit": x.Unit})

    Chat = []
    for interaction in input.Interactions:
        for Persona, Prompt in interaction.items():
            Chat.append({f"{Persona}": f"{Prompt}"})
    
    Results = {
        "ReceivedInputs": {
            "Ingredients": Ings,
            "Messages": {
                "SystemPrompt": input.SystemPrompt,
                "Chat": Chat
            }
        }
    }

    return Results

@app.post("/inference/", dependencies = [Depends(validate_api_key)])
async def Predict(input: Input):
    '''
    # Implement your prediction logic here
    Ings = "\n".join([f"{x.Name}: {x.Quantity} {x.Unit}" for x in input.Ingredients])
    systemPrompt = input.SystemPrompt if input.SystemPrompt else "Default System Prompt"
    interactionsString = "\n".join(f"{Persona}: {Prompt}" for interaction in input.Interactions for Persona, Prompt in interaction.items())
    Result = f"""Received the Following Ingredients: {Ings}
    SystemPrompt: {systemPrompt}
    Interactions: {interactionsString}
    """
    '''


    
    '''
    humanPrompt = "{Input}"

    InputPrompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are a Very Cool AI Chef named {AIName} with {Roots} roots",
            ),
            ("human", "{Input}"),
        ]
    )

    CheckRefinePrompt = ChatPromptTemplate.from_messages(
        (
            "system",
            "You are a Very Cool AI Chef named {AIName} with {Roots} roots",
        )



    )
    '''

    # Defining Gemini LLM
    LLM = ChatGoogleGenerativeAI(
        model = "gemini-1.5-flash",
        temperature = 0,
        max_tokens = None,
        timeout = None,
        max_retries = 3,
    )

    # Creating an Initial ChatPromptTemplate
    SystemPrompt = "You are a Very Cool AI Chef named {AIName} with {Roots} roots"
    SystemMessagePrompt = SystemMessagePromptTemplate.from_template(SystemPrompt)
    HumanPrompt = "{Input}"
    HumanMessagePrompt = HumanMessagePromptTemplate.from_template(HumanPrompt)

    # Actual Chat that will get Extended
    Chat = ChatPromptTemplate.from_messages([SystemMessagePrompt, HumanMessagePrompt])

    # Defining the Chain
    Chain = Chat | LLM

    # Generating the Recipe
    Recipe = Chain.invoke(
        {
            "AIName": "Alfredo",
            "Roots": "Italian",
            "Input": "I have 2 Bananas, 200 Grams of Chocolate, and Some Milk, can you suggest a cool recipe for me to cook?",
        }
    )

    # Appening AI Response and Asking for Refinement
    AIRecipe = Recipe.content
    AIMessagePrompt = AIMessagePromptTemplate.from_template(AIRecipe)
    Chat.messages.append(AIMessagePrompt)

    HumanPrompt = "I actually found 400 Grams of Strawberries, can you make a variations including them?"
    HumanMessagePrompt = HumanMessagePromptTemplate.from_template(HumanPrompt)
    Chat.messages.append(HumanMessagePrompt)

    # Invoking Again the Refined Recipe
    NewRecipe = Chain.invoke(
        {
            "AIName": "Alfredo",
            "Roots": "Italian",
            "Input": "I have 2 Bananas, 200 Grams of Chocolate, and Some Milk, can you suggest a cool recipe for me to cook?",
        }
    )

    return Recipe, NewRecipe




