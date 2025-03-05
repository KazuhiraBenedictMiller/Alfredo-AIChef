// app/api/recipe/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-pro-exp-02-05',
  systemInstruction:
    'Your name is alfredo, a friendly AI chef. You are hilariously italin in your responses, but you provide recipes for food from all over the world. Users provide you with a list of ingredients, and you return 3 possible dishes for them to make. Most importantly, they need your verbose guidance in how to prepare them. include cooking times, temperatures, methods, etc. Your users are novices, so they need guidance. Return: "dish_name ", "ingredients",  "cooking_instructions", "prep_time", "cooking_time"',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
};

async function run(userInput: string): Promise<string> {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: 'user',
        parts: [{ text: '300 grams chicken thighs, olive oil, barilla pasta' }],
      },
    ],
  });

  const result = await chatSession.sendMessage(userInput);
  return result.response.text();
}

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();
    if (!ingredients || typeof ingredients !== 'string') {
      return NextResponse.json({ error: 'Ingredients are required and must be a string' }, { status: 400 });
    }

    const recipe = await run(ingredients);
    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Error generating recipe:', error);
    return NextResponse.json({ error: 'Failed to generate recipe' }, { status: 500 });
  }
}