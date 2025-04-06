/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/recipe/route.ts
import { NextResponse } from 'next/server';
import {
  GoogleGenerativeAI,
  GenerationConfig, // Import GenerationConfig type
  GenerativeModel, // Import GenerativeModel type
} from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('[API KEY ERROR] API key is not configured.');
  throw new Error('API key is not configured.');
}

const genAI = new GoogleGenerativeAI(apiKey);

// --- Model Definitions ---

// Model for Recipe Generation (expects JSON output)
const recipeModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash', // Using 1.5 flash is recommended
  systemInstruction:
    'Your name is alfredo, a friendly AI chef. You are hilariously italian in your responses, but you provide recipes for food from all over the world. Users provide you with a list of ingredients and a prior analysis. Your task is ONLY to return 3 possible dishes based on this information. Provide verbose guidance for novices (cooking times, temperatures, methods, etc.) since they need guidance the most. Always Return a JSON array containing exactly 3 recipe objects without Markdown. Each object must have these properties: "dish_name", "ingredients" (list of strings), "cooking_instructions" (list of strings), "prep_time" (string like "15 minutes"), "cooking_time" (string like "30 minutes"). No extra conversation, just the JSON.',
});

// Model for Ingredient Analysis (expects text analysis)
const analysisModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash', // Using 1.5 flash
  systemInstruction:
    'Your name is alfredo, a friendly AI chef. You are hilariously italian in your responses. Users provide you with a list of ingredients and the type of meal they want (e.g., breakfast, dinner). Your task is ONLY to analyse their flavors, textures, and potential pairings, considering the desired meal type. Provide a brief but insightful culinary analysis (a few sentences to a paragraph) highlighting the strengths and potential uses of the provided ingredients for that specific meal. This analysis will be used later to create recipes. Do NOT suggest specific dishes yet. Just provide the analysis text.',
});

// --- Generation Config Definitions ---

// Generation Config for the Recipe Model (requires JSON)
const recipeGenerationConfig: GenerationConfig = {
  temperature: 0.8, // Slightly lower temp for more predictable JSON structure
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json', // Essential for JSON output
};

// Generation Config for the Analysis Model (expects text)
const analysisGenerationConfig: GenerationConfig = {
  temperature: 1, // More creative for analysis
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 1024, // Analysis likely shorter than recipes
  // responseMimeType: "text/plain", // Explicitly text/plain or omit for default
};

// --- Prompt Templates ---

// Prompt for the Analysis step (includes {MEAL})
const analysisUserPromptTemplate = `For the Recipes you are Building Here are some key considerations to keep in mind:

The recipes should be simple and easy to follow, even for novice cooks.
The recipes should be flavorful and appealing, using the ingredients provided.
I have the Following Ingredients: {INGREDIENTS}
I would like to make a {MEAL} with them.

Consider their flavors, textures, and potential pairings. Provide a brief culinary analysis to inform the recipe creation in the next step
Tell me, Alfredo, what culinary magic can we see here for these ingredients. Analyse the flavors, the textures, the beautiful potential! Give me your expert Italian insights, Just the analysis for now`;

// Prompt for the Recipe Generation step (includes {ANALYSIS})
const recipeUserPromptTemplate = `Given these Following Ingredients:

{INGREDIENTS}

And These Considerations and Analysis you provided earlier about the ingredients:

{ANALYSIS}

I want you to Give Names to 3 distinct Recipes and Provide the Step by Step Guidance on how to prepare each of them, given That:

The returned recipe should be a flavorful dish that leverages the best pairings and preparation techniques based on the available ingredients.
IMPORTANT: Longer returns are better, as they provide more detail and guidance for the user.
IMPORTANT: Your response MUST be a valid JSON array with 3 recipe objects. 
IMPORTANT: DO NOT use any Markdown formatting in your response. No asterisks (**) for bold text.
IMPORTANT: Each recipe object should have these exact properties: "dish_name", "ingredients", "cooking_instructions", "prep_time", "cooking_time"
IMPORTANT: Give me *only* the JSON array with 3 recipe objects, exactly like we discussed. No extra talk, just the JSON data! Properties needed: "dish_name", "ingredients", "cooking_instructions", "prep_time", "cooking_time
`;

// --- Generic run function ---
// Takes the model, config, prompt, and optional history (defaults to empty)
async function run(
  modelToUse: GenerativeModel,
  config: GenerationConfig,
  userInput: string,
  // History is optional and defaults to empty. For this flow, we always pass []
  history: any[] = []
): Promise<string> {
  // Returns only the result string
  if (!apiKey) throw new Error('API key missing');

  // Start chat with the specific model, config, and history (will be empty)
  const chatSession = modelToUse.startChat({
    generationConfig: config,
    history: history,
  });
  console.log(
    `[API RUN] Sending prompt to model ${modelToUse.model}. History length: ${history.length}`
  );
  console.log('[API RUN] Prompt:', userInput.substring(0, 200) + '...'); // Log truncated prompt

  try {
    const result = await chatSession.sendMessage(userInput);
    const response = result?.response;

    if (!response) {
      throw new Error('Invalid response object received from model.');
    }
    // Check for blocking reasons *before* accessing text
    if (response.promptFeedback?.blockReason) {
      console.error(
        `[API RUN] Prompt blocked for model ${modelToUse.model} due to ${response.promptFeedback.blockReason}`
      );
      throw new Error(
        `Prompt blocked due to ${response.promptFeedback.blockReason}`
      );
    }
    if (response.candidates?.[0]?.finishReason === 'SAFETY') {
      console.error(
        `[API RUN] Response blocked for model ${modelToUse.model} due to safety settings.`
      );
      throw new Error('Response blocked due to safety settings.');
    }
    if (response.candidates?.[0]?.finishReason === 'RECITATION') {
      console.warn(
        `[API RUN] Response potentially blocked for model ${modelToUse.model} due to recitation.`
      );
      // Decide if you want to throw or allow potentially partial/empty response
    }

    // Get response text *after* safety checks
    const responseText = response?.text() ?? '';

    // Log other non-STOP finish reasons
    if (
      response.candidates?.[0]?.finishReason !== 'STOP' &&
      response.candidates?.[0]?.finishReason !== 'MAX_TOKENS'
    ) {
      console.warn(
        `[API RUN] Model ${modelToUse.model} finished for reason:`,
        response.candidates?.[0]?.finishReason
      );
    }
    if (
      !responseText &&
      response.candidates?.[0]?.finishReason !== 'STOP' &&
      response.candidates?.[0]?.finishReason !== 'MAX_TOKENS'
    ) {
      console.warn(
        `[API RUN] Empty response text received from ${modelToUse.model}. Finish reason: ${response.candidates?.[0]?.finishReason}`
      );
    }

    console.log(
      `[API RUN] Received response text length from ${modelToUse.model}:`,
      responseText.length
    );

    // Return only the text result
    return responseText;
  } catch (error: any) {
    console.error(
      `[API RUN] Error during Gemini API call for model ${modelToUse.model}:`,
      error
    );
    if (error.response?.data) {
      console.error('[API RUN] Error response data:', error.response.data);
    }
    throw error; // Re-throw for the POST handler
  }
}

// --- Helper function to remove Markdown ---
function removeMarkdown(text: string): string {
  // Remove ```json ... ``` blocks if present
  text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  // Remove bold markdown (**text**) - Keep this as a fallback
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');
  // Remove italic markdown (*text* or _text_)
  text = text.replace(/([*_])(.*?)\1/g, '$2');
  return text.trim(); // Trim whitespace
}

// --- POST Handler ---
export async function POST(request: Request) {
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured.' },
      { status: 500 }
    );
  }

  try {
    // Expect 'ingredients' and 'meal' in the request body
    const { ingredients, meal } = await request.json();

    // Validate inputs
    if (
      !ingredients ||
      typeof ingredients !== 'string' ||
      ingredients.trim() === ''
    ) {
      return NextResponse.json(
        { error: 'Ingredients are required and must be a non-empty string' },
        { status: 400 }
      );
    }
    if (!meal || typeof meal !== 'string' || meal.trim() === '') {
      return NextResponse.json(
        { error: 'Meal type is required and must be a non-empty string' },
        { status: 400 }
      );
    }
    console.log('[POST HANDLER] Received ingredients:', ingredients);
    console.log('[POST HANDLER] Received meal type:', meal);

    // *** FIRST LLM CALL: Ingredient Analysis ***
    console.log('[POST HANDLER] Starting ingredient analysis call...');
    const analysisPrompt = analysisUserPromptTemplate
      .replace('{INGREDIENTS}', ingredients)
      .replace('{MEAL}', meal); // Add meal type to the prompt

    let analysisResultText: string;
    try {
      // Use analysisModel, analysisConfig, analysisPrompt, and crucially an empty history []
      analysisResultText = await run(
        analysisModel,
        analysisGenerationConfig,
        analysisPrompt,
        [] // Start a new, independent conversation
      );
      console.log(
        '[POST HANDLER] Analysis result received:',
        analysisResultText.substring(0, 300) + '...'
      ); // Log truncated analysis
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

    // *** SECOND LLM CALL: Recipe Generation ***
    console.log('[POST HANDLER] Starting recipe generation call...');
    const finalRecipePrompt = recipeUserPromptTemplate
      .replace('{INGREDIENTS}', ingredients)
      .replace('{ANALYSIS}', analysisResultText); // Use the text from the first call

    let finalRecipeJsonString: string;
    try {
      // Use recipeModel, recipeConfig, finalRecipePrompt, and crucially an empty history []
      const rawRecipeResult = await run(
        recipeModel,
        recipeGenerationConfig,
        finalRecipePrompt,
        [] // Start a second, independent conversation
      );

      // Clean the response to ensure it's just the JSON
      finalRecipeJsonString = removeMarkdown(rawRecipeResult);

      console.log('[POST HANDLER] Cleaned final recipe JSON string received.');

      // Basic validation: Check if it starts/ends like an array (JSON array expected)
      const trimmedResult = finalRecipeJsonString.trim();
      if (!(trimmedResult.startsWith('[') && trimmedResult.endsWith(']'))) {
        console.warn(
          "[POST HANDLER] Final recipe output doesn't look like a JSON array:",
          finalRecipeJsonString // Log the problematic string
        );
        // Consider throwing an error if strict JSON array format is absolutely required
        // throw new Error("Received recipe data is not in the expected JSON array format.");
      }

      // Attempt to parse to ensure it's valid JSON before sending
      try {
        JSON.parse(finalRecipeJsonString);
        console.log(
          '[POST HANDLER] Final recipe string successfully parsed as JSON.'
        );
      } catch (parseError) {
        console.error(
          '[POST HANDLER] Failed to parse final recipe string as JSON:',
          parseError
        );
        console.error(
          '[POST HANDLER] String that failed parsing:',
          finalRecipeJsonString
        );
        // Throw a specific error if parsing fails
        throw new Error(
          'The AI model returned invalid JSON data for the recipes.'
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
          details: error.message, // Provide detailed error
        },
        { status: 500 }
      );
    }

    // Return the cleaned JSON string within the response object
    // Client side will need to parse this string: JSON.parse(response.recipe)
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
