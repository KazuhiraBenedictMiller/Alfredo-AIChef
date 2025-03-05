'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';

interface RecipeIngredient {
  dish_name: string;
  ingredients: string[];
  cooking_instructions: string;
  prep_time: string;
  cooking_time: string;
}

interface ApiResponse {
  recipe: string; // The inner JSON string
}

export const RecipeBuilder = () => {
  const [ingredients, setIngredients] = useState<string>('');

  const { data, isError, error, isPending, mutateAsync } = useMutation<ApiResponse, Error, { ingredients: string }>({
    mutationFn: async ({ ingredients }) => {
      try {
        const { data } = await axios.post<ApiResponse>('/api/recipe', {
          ingredients,
        });
        return data;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(err.message);
        }
        throw new Error('An unknown error occurred');
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutateAsync({ ingredients });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Enter ingredients"
        />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Loading...' : 'Get Recipe'}
        </button>
      </form>
      {isError && <p style={{ color: 'red' }}>{error?.message}</p>}
      {data && (
        <div>
          {(() => {
            try {
              const recipes: RecipeIngredient[] = JSON.parse(data.recipe);
              return recipes.map((recipe, index) => (
                <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                  <h3>{recipe.dish_name}</h3>
                  <h4>Ingredients:</h4>
                  <ul>
                    {recipe.ingredients.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>
                  <h4>Cooking Instructions:</h4>
                  <p>{recipe.cooking_instructions}</p>
                  <p>Prep Time: {recipe.prep_time}</p>
                  <p>Cooking Time: {recipe.cooking_time}</p>
                </div>
              ));
            } catch (e) {
              return <p>Error parsing recipe data.</p>;
            }
          })()}
        </div>
      )}
    </div>
  );
};