import { useState } from 'react';
import {
  IngredientRow,
  RecipeIngredient,
  RecipePayload,
} from '../interfaces/recipe-interface';
import { useMutation } from '@tanstack/react-query';
import { getRecipes } from '../services/get-recipe';

export const useRecipeBuilder = () => {
  const [amount, setAmount] = useState<number>(1);

  const [unit, setUnit] = useState<'g' | 'kg' | 'ml' | 'pcs'>('g');
  const [rows, setRows] = useState<IngredientRow[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');
  const [selectedMeal, setSelectedMeal] = useState<string>('');
  const [selectedRecipe, setSelectedRecipe] = useState<number>(0);

  const { data, isPending, mutateAsync } = useMutation<
    RecipeIngredient[],
    Error,
    { ingredients: string }
  >({
    mutationFn: getRecipes,
  });

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
    setAmount(1);
  };

  const handleReset = () => {
    setRows([]);
    setSelectedIngredient('');
    setAmount(1);
  };
  return {
    get: {
      data,
      amount,
      unit,
      selectedIngredient,
      rows,
      selectedRecipe,
      selectedMeal,
    },
    set: {
      amount: setAmount,
      unit: setUnit,
      selectedIngredient: setSelectedIngredient,
      rows: setRows,
      selectedRecipe: setSelectedRecipe,
      selectedMeal: setSelectedMeal,
    },
    handle: {
      addRow: handleAddRow,
      generateClick: handleGenerateClick,
      next: handleNext,
      prev: handlePrev,
    },
    reset: handleReset,
    is: {
      addDisabled:
        selectedIngredient === '' ||
        amount === 0 ||
        rows.some((r) => r.ingredient === selectedIngredient),
      nextDisabled: !data || selectedRecipe === data.length - 1,
      prevDisabled: selectedRecipe === 0,
      dataPending: isPending,
    },
  };
};
