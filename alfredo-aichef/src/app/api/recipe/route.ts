// app/api/recipe/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `Your name is alfredo, a friendly AI chef. You are hilariously italian in your responses, but you provide recipes for food from all over the world. Users provide you with a list of ingredients, and you return possible dishes for them to make. Most importantly, they need your verbose guidance in how to prepare them. include cooking times, temperatures, methods, etc. Your users are novices, so they need guidance.`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const initialUserPromptTemplate = `For the Recipes you are Building Here are some key considerations to keep in mind:

The Returned Output Should be structured as JSON format. Ensure valid JSON syntax.
The Returned Output Field Must Include: Dish Name, Ingredients, Cooking Instructions, Preparation Time, Cooking Time. Feel Free to Add More Categories and Notes as you Wish.
The returned recipe should be a flavorful dish that leverages the best pairings and preparation techniques based on the available ingredients.

I have the Following Ingredients: {INGREDIENTS}

Your Very First Step is to generate ideas around the taste of the ingredients and to analyse them before preparing.
Consider their flavors, textures, and potential pairings. Provide a brief culinary analysis to inform the recipe creation in the next step`;

const finalUserPromptTemplate = `Given these Following Ingredients: 

{INGREDIENTS}

And These Considerations and Analysis:

{ANALYSIS}

I want you to Give Name to the Recipe and Provide the Step by Step Guidance on how to prepare it, given That:

The Returned Output Should be structured as JSON format. Ensure valid JSON syntax.
The Returned Output Field Must Include: Dish Name, Ingredients, Cooking Instructions, Preparation Time, Cooking Time. Feel Free to Add More Categories and Notes as you Wish.
The returned recipe should be a flavorful dish that leverages the best pairings and preparation techniques based on the available ingredients.`;

async function run(userInput: string, history: any[] = []): Promise<{ result: string; updatedHistory: any[] }> {
  const chatSession = model.startChat({
    generationConfig,
    history: history,
  });

  const result = await chatSession.sendMessage(userInput);
  const responseText = result.response.text();

  //Update the chat history
  const updatedHistory = [
    ...history,
    { role: 'user', parts: [{ text: userInput }] },
    { role: 'model', parts: [{ text: responseText }] },
  ];

  return { result: responseText, updatedHistory: updatedHistory };
}

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();
    if (!ingredients || typeof ingredients !== "string") {
      return NextResponse.json(
        { error: "Ingredients are required and must be a string" },
        { status: 400 }
      );
    }

    let chatHistory: any[] = []; // Initialize chat history

    // *** FIRST LLM CALL: Ingredient Analysis ***
    const initialPrompt = initialUserPromptTemplate.replace("{INGREDIENTS}", ingredients);
    const analysisResult = await run(initialPrompt, chatHistory); // gets text analysis of ingredients
    chatHistory = analysisResult.updatedHistory; // Update chat history with the first turn

    // *** SECOND LLM CALL: Recipe Generation ***
    const finalPrompt = finalUserPromptTemplate
      .replace("{INGREDIENTS}", ingredients)
      .replace("{ANALYSIS}", analysisResult.result);

    const recipeResult = await run(finalPrompt, chatHistory); // create the recipe based on the analysis
    const recipe = recipeResult.result;

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Error generating recipe:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe" },
      { status: 500 }
    );
  }
}