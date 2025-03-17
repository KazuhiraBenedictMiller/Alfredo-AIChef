'use client';

import { Button, Stack, Typography, Card, CardContent } from '@mui/material';
import { IngredientSelect } from './ingredient-select';
import { QuantityTextField } from './quantity-textfield';
import { IngredientDg, IngredientRow } from './ingredient-dg';
import { GradientTitle } from '../common/gradient-title';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const ingredients = [
  { label: 'Tomato', value: 'tomato' },
  { label: 'Onion', value: 'onion' },
  { label: 'Garlic', value: 'garlic' },
  { label: 'Ginger', value: 'ginger' },
  { label: 'Chilli', value: 'chilli' },
  { label: 'Coriander', value: 'coriander' },
  { label: 'Cumin', value: 'cumin' },
  { label: 'Turmeric', value: 'turmeric' },
  { label: 'Basil', value: 'basil' },
  { label: 'Oregano', value: 'oregano' },
  { label: 'Parsley', value: 'parsley' },
  { label: 'Thyme', value: 'thyme' },
  { label: 'Rosemary', value: 'rosemary' },
  { label: 'Mint', value: 'mint' },
  { label: 'Sage', value: 'sage' },
  { label: 'Dill', value: 'dill' },
];

interface RecipeIngredient {
  dish_name: string;
  ingredients: { ingredient: string; quantity: number; unit: string }[]; // Fixing type for structured ingredient objects
  cooking_instructions: string;
  prep_time: string;
  cooking_time: string;
}

interface ApiResponse {
  recipe: string; // JSON string containing an array of recipes
}

export type RecipePayload = Partial<IngredientRow>;

export const RecipeBuilderV2 = () => {
  const [amount, setAmount] = useState<number>(0);
  const [unit, setUnit] = useState<'g' | 'kg' | 'ml' | 'pcs'>('g');
  const [rows, setRows] = useState<IngredientRow[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');
  const [parsedRecipes, setParsedRecipes] = useState<RecipeIngredient[] | null>(null);

  const { data, isPending, mutateAsync } = useMutation<ApiResponse, Error, { ingredients: string }>({
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

  // Handle parsing API response
  useEffect(() => {
    if (data?.recipe) {
      try {
        const recipes: RecipeIngredient[] = JSON.parse(data.recipe); // First parse to get JSON
        setParsedRecipes(recipes);
      } catch (error) {
        console.error('Error parsing API response:', error);
        setParsedRecipes(null);
      }
    }
  }, [data]);

  const handleGenerateClick = async () => {
    const ingredientsPayload = rows.map(
      (row): RecipePayload => ({
        ingredient: row.ingredient,
        quantity: row.quantity,
        unit: row.unit,
      })
    );
    await mutateAsync({ ingredients: JSON.stringify(ingredientsPayload) });
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        ingredient: selectedIngredient,
        quantity: amount,
        unit,
      },
    ]);
    setSelectedIngredient('');
    setAmount(0);
  };

  const handleReset = () => {
    setRows([]);
    setSelectedIngredient('');
    setAmount(0);
    setParsedRecipes(null);
  };

  const addDisabled = selectedIngredient === '' || amount === 0;

  return (
    <Stack gap={2}>
      <GradientTitle title="Hi there, user! What are you going to cook today?" />
      <Stack flexDirection={'row'} gap={1} justifyContent={'flex-start'} mt={2}>
        <IngredientSelect options={ingredients} selected={selectedIngredient} setSelected={setSelectedIngredient} />
        <QuantityTextField amount={amount} setAmount={setAmount} unit={unit} setUnit={setUnit} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddRow} disabled={addDisabled}>
          Add
        </Button>
      </Stack>
      <IngredientDg rows={rows}></IngredientDg>
      <Stack flexDirection={'row'} gap={1} justifyContent={'space-between'}>
        <Button onClick={handleReset} variant="outlined" color="error">
          Reset
        </Button>
        <Button variant="contained" startIcon={<AutoAwesomeIcon />} onClick={handleGenerateClick} disabled={isPending}>
          {isPending ? 'Loading...' : 'Generate'}
        </Button>
      </Stack>

      {/* Display Recipes */}
      {parsedRecipes && (
        <Stack gap={2} mt={3}>
          <Typography variant="h5">Recipes</Typography>
          {parsedRecipes.map((recipe, index) => (
            <Card key={index} sx={{ border: '1px solid #ccc', borderRadius: '8px' }}>
              <CardContent>
                <Typography variant="h6">{recipe.dish_name}</Typography>
                <Typography variant="subtitle1">Ingredients:</Typography>
                <ul>
                  {recipe.ingredients && Array.isArray(recipe.ingredients) ? (
                    recipe.ingredients.map((ingredient, i) => (
                      <li key={i}>
                        {typeof ingredient === 'string'
                          ? ingredient
                          : `${ingredient.quantity} ${ingredient.unit} of ${ingredient.ingredient}`}
                      </li>
                    ))
                  ) : (
                    <li>{JSON.stringify(recipe.ingredients)}</li> // Debugging fallback
                  )}
                </ul>
                <Typography variant="subtitle1">Instructions:</Typography>
                <Typography>{recipe.cooking_instructions}</Typography>
                <Typography>Prep Time: {recipe.prep_time}</Typography>
                <Typography>Cooking Time: {recipe.cooking_time}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
