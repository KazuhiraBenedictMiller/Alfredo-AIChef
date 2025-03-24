import axios from 'axios';
import {
  GetRecipePayload,
  GetRecipeResponse,
  RecipeIngredient,
} from '../interfaces/recipe-interface';

export const getRecipes = async ({
  ingredients,
}: GetRecipePayload): Promise<RecipeIngredient[]> => {
  try {
    const { data } = await axios.post<GetRecipeResponse>('/api/recipe', {
      ingredients,
    });
    if (data?.recipe) {
      return JSON.parse(data.recipe);
    } else {
      return [];
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error('An unknown error occurred');
  }
};
