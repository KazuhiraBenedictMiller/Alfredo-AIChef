export interface RecipeIngredient {
  dish_name: string;
  ingredients: { ingredient: string; quantity: number; unit: string }[]; // Fixing type for structured ingredient objects
  cooking_instructions: string;
  prep_time: string;
  cooking_time: string;
}

export interface IngredientRow {
  id: number;
  ingredient: string;
  quantity: number;
  unit: string;
}

export interface GetRecipePayload {
  ingredients: string;
  meal: string;
}

export interface GetRecipeResponse {
  recipe: string;
}

export type RecipePayload = Partial<IngredientRow>;
