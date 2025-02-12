#!/bin/bash
# Script to call the FastAPI /predict/ endpoint

# Define variables
API_URL="localhost:8000/inference/"
AUTH_KEY="AlfredoAIAPIEndpoint"
JSON_FILE="sample.json"

# Check if the JSON file exists
if [ ! -f "$JSON_FILE" ]; then
  echo "Error: $JSON_FILE not found!"
  exit 1
fi

# Make the API call with curl
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Auth: $AUTH_KEY" \
  -d @"$JSON_FILE"