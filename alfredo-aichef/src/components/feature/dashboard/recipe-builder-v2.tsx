'use client';

import {
  Button,
  Stack,
  Typography,
  Card,
  CardContent,
  Grid2,
  IconButton,
} from '@mui/material';
import { IngredientSelect } from './ingredient-select';
import { QuantityTextField } from './quantity-textfield';
import { IngredientDg, IngredientRow } from './ingredient-dg';
import { GradientTitle } from '../../common/gradient-title';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { RecipeLoader } from './recipe-loader';
import { ingredients } from '@/constants/ingredients';

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
  const [parsedRecipes, setParsedRecipes] = useState<RecipeIngredient[] | null>(
    null
  );
  const [selectedRecipe, setSelectedRecipe] = useState<number>(0);

  const { data, isPending, mutateAsync } = useMutation<
    ApiResponse,
    Error,
    { ingredients: string }
  >({
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

  const handlePrev = () => {
    setSelectedRecipe((prev) => prev - 1);
  };

  const handleNext = () => {
    setSelectedRecipe((prev) => prev + 1);
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
  const prevDisabled = selectedRecipe === 0;
  const nextDisabled =
    !parsedRecipes || selectedRecipe === parsedRecipes.length - 1;

  return (
    <>
      <Grid2 size={{ md: 12, lg: 6 }}>
        <GradientTitle title="Hi there, user! What are you going to cook today?" />
        <Stack
          flexDirection={'row'}
          gap={1}
          justifyContent={'flex-start'}
          mt={2}
          flexWrap={'wrap'}
        >
          <IngredientSelect
            options={ingredients}
            selected={selectedIngredient}
            setSelected={setSelectedIngredient}
          />
          <QuantityTextField
            amount={amount}
            setAmount={setAmount}
            unit={unit}
            setUnit={setUnit}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddRow}
            disabled={addDisabled}
          >
            Add
          </Button>
        </Stack>
        <IngredientDg rows={rows} setRows={setRows}></IngredientDg>
        <Stack
          flexDirection={'row'}
          gap={1}
          mt={2}
          justifyContent={'space-between'}
        >
          <Button onClick={handleReset} variant="outlined" color="error">
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<AutoAwesomeIcon />}
            onClick={handleGenerateClick}
            disabled={isPending}
          >
            {isPending ? 'Loading...' : 'Generate'}
          </Button>
        </Stack>
      </Grid2>
      <Grid2 size={{ md: 12, lg: 6 }}>
        {isPending || !parsedRecipes ? (
          <RecipeLoader />
        ) : (
          <Stack gap={2} mt={3}>
            <Stack flexDirection={'row'} justifyContent={'space-between'}>
              <Typography variant="h5">Recipes</Typography>
              <Stack flexDirection={'row'}>
                <IconButton onClick={handlePrev} disabled={prevDisabled}>
                  <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
                </IconButton>
                <IconButton onClick={handleNext} disabled={nextDisabled}>
                  <ArrowForwardIosIcon></ArrowForwardIosIcon>
                </IconButton>
              </Stack>
            </Stack>
            <Card sx={{ border: '1px solid #ccc', borderRadius: '8px' }}>
              <CardContent>
                <Typography variant="h6">
                  {parsedRecipes[selectedRecipe].dish_name}
                </Typography>
                <Typography variant="subtitle1">Ingredients:</Typography>
                <ul>
                  {parsedRecipes[selectedRecipe].ingredients &&
                    parsedRecipes[selectedRecipe].ingredients.map(
                      (ingredient, i) => (
                        <li key={i}>
                          {typeof ingredient === 'string'
                            ? ingredient
                            : `${ingredient.quantity} of ${ingredient.ingredient}`}
                        </li>
                      )
                    )}
                </ul>
                <Typography variant="subtitle1">Instructions:</Typography>
                <Typography>
                  {parsedRecipes[selectedRecipe].cooking_instructions}
                </Typography>
                <Typography>
                  Prep Time: {parsedRecipes[selectedRecipe].prep_time}
                </Typography>
                <Typography>
                  Cooking Time: {parsedRecipes[selectedRecipe].cooking_time}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        )}
      </Grid2>
    </>
  );
};
