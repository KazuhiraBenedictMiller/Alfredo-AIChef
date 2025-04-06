// app/api/recipe/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('[API KEY ERROR] API key is not configured.');
  throw new Error('API key is not configured.');
}

const genAI = new GoogleGenerativeAI(apiKey);

// System instruction from the TARGET example (requests 3 recipes, defines format)
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction:
    'Your name is alfredo, a friendly AI chef. You are hilariously italin in your responses, but you provide recipes for food from all over the world. Users provide you with a list of ingredients, and you return 3 possible dishes for them to make. Most importantly, they need your verbose guidance in how to prepare them. include cooking times, temperatures, methods, etc. Your users are novices, so they need guidance. Return: JSON without Markdown "dish_name ", "ingredients",  "cooking_instructions", "prep_time", "cooking_time"',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
};

// Original initial prompt template
const initialUserPromptTemplate = `For the Recipes you are Building Here are some key considerations to keep in mind:

The recipes should be simple and easy to follow, even for novice cooks.
The recipes should be flavorful and appealing, using the ingredients provided.
I have the Following Ingredients: {INGREDIENTS}
I would like to make a {MEAL} with them.

Your Very First Step is to generate ideas around the taste of the ingredients and to analyse them before preparing.
Consider their flavors, textures, and potential pairings. Provide a brief culinary analysis to inform the recipe creation in the next step`;

// *** MODIFIED finalUserPromptTemplate (Minimal change for quantity) ***
const finalUserPromptTemplate = `Given these Following Ingredients:

{INGREDIENTS}

And These Considerations and Analysis:

{ANALYSIS}

I want you to Give Names to 3 distinct Recipes and Provide the Step by Step Guidance on how to prepare each of them, given That:

The returned recipe should be a flavorful dish that leverages the best pairings and preparation techniques based on the available ingredients.
IMPORTANT: Longer returns are better, as they provide more detail and guidance for the user.
IMPORTANT: Your response MUST be a valid JSON array with 3 recipe objects. 
IMPORTANT: DO NOT use any Markdown formatting in your response. No asterisks (**) for bold text.
IMPORTANT: Each recipe object should have these exact properties: "dish_name", "ingredients", "cooking_instructions", "prep_time", "cooking_time"`;

// run function remains the same
async function run(
  userInput: string,
  history: any[] = []
): Promise<{ result: string; updatedHistory: any[] }> {
  // (Keep the robust run function from the previous version with logging/error checks)
  if (!apiKey) {
    /* Handle missing key */ throw new Error('API key missing');
  }
  const chatSession = model.startChat({ generationConfig, history });
  console.log('[API RUN] Sending prompt:', userInput);
  console.log('[API RUN] History length:', history.length);
  try {
    const result = await chatSession.sendMessage(userInput);
    const response = result?.response;
    const responseText = response?.text() ?? '';
    if (!response)
      throw new Error('Invalid response object received from model.');
    if (response.promptFeedback?.blockReason)
      throw new Error(
        `Prompt blocked due to ${response.promptFeedback.blockReason}`
      );
    if (response.candidates?.[0]?.finishReason === 'SAFETY')
      throw new Error('Response blocked due to safety settings.');
    if (
      response.candidates?.[0]?.finishReason !== 'STOP' &&
      response.candidates?.[0]?.finishReason !== 'MAX_TOKENS'
    ) {
      console.warn(
        '[API RUN] Model finished for reason:',
        response.candidates?.[0]?.finishReason
      );
    }
    console.log(
      '[API RUN] Received response text length:',
      responseText.length
    );
    const updatedHistory = [
      ...history,
      { role: 'user', parts: [{ text: userInput }] },
      { role: 'model', parts: [{ text: responseText }] },
    ];
    return { result: responseText, updatedHistory: updatedHistory };
  } catch (error: any) {
    console.error('[API RUN] Error during Gemini API call:', error);
    throw error;
  }
}

// Add this function to remove any Markdown formatting
function removeMarkdown(text: string): string {
  // Remove bold markdown (**text**)
  return text.replace(/\*\*(.*?)\*\*/g, '$1');
}

// POST handler remains the same structure, just uses the modified final prompt template
export async function POST(request: Request) {
  if (!apiKey) {
    /* Handle missing key */ return NextResponse.json(
      { error: 'API key not configured.' },
      { status: 500 }
    );
  }
  try {
    const { ingredients, meal } = await request.json();
    if (
      !ingredients ||
      typeof ingredients !== 'string' ||
      ingredients.trim() === '' ||
      !meal ||
      typeof meal !== 'string' ||
      meal.trim() === ''
    ) {
      return NextResponse.json(
        { error: 'Ingredients are required and must be a non-empty string' },
        { status: 400 }
      );
    }
    let chatHistory: any[] = [];
    // *** FIRST LLM CALL ***
    const initialPrompt = initialUserPromptTemplate
      .replace('{INGREDIENTS}', ingredients)
      .replace('{MEAL}', meal);

    let analysisResultText: string;
    try {
      const analysisResult = await run(initialPrompt, chatHistory);
      analysisResultText = analysisResult.result;
      chatHistory = analysisResult.updatedHistory;
      console.log('[POST HANDLER] Analysis result received.');
    } catch (error: any) {
      console.error('[POST HANDLER] Error during analysis call:', error);
      return NextResponse.json(
        {
          error: 'Failed during ingredient analysis phase.',
          details: error.message,
        },
        { status: 500 }
      );
    }
    // *** SECOND LLM CALL (uses MODIFIED finalUserPromptTemplate) ***
    const finalPrompt = finalUserPromptTemplate // Use the modified template here
      .replace('{INGREDIENTS}', ingredients)
      .replace('{ANALYSIS}', analysisResultText);
    let finalRecipeJsonString: string;
    try {
      const recipeResult = await run(finalPrompt, chatHistory);
      let resultText = recipeResult.result;

      // Clean up any remaining markdown in the response
      resultText = removeMarkdown(resultText);
      finalRecipeJsonString = resultText;

      console.log('[POST HANDLER] Final recipe string received.');
      // Optional basic validation
      const trimmedResult = finalRecipeJsonString?.trim() ?? '';
      if (
        !(trimmedResult.startsWith('[') && trimmedResult.endsWith(']')) &&
        !(trimmedResult.startsWith('{') && trimmedResult.endsWith('}'))
      ) {
        console.warn(
          "[POST HANDLER] Final recipe output doesn't look like a JSON array/object:",
          finalRecipeJsonString
        );
      }
    } catch (error: any) {
      console.error(
        '[POST HANDLER] Error during recipe generation call:',
        error
      );
      return NextResponse.json(
        {
          error: 'Failed during recipe generation phase.',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ recipe: finalRecipeJsonString });
  } catch (error: any) {
    console.error('[POST HANDLER] Top-level error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json(
      {
        error: 'An unexpected error occurred processing your request.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
