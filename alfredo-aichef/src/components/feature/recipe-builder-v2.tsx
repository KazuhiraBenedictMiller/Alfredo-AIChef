'use client';

import { Button, Stack } from '@mui/material';
import { IngredientSelect } from './ingredient-select';
import { QuantityTextField } from './quantity-textfield';
import { IngredientDg, IngredientRow } from './ingredient-dg';
import { GradientTitle } from '../common/gradient-title';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useState } from 'react';

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

export const RecipeBuilderV2 = () => {
  const [amount, setAmount] = useState<number>(0);
  const [unit, setUnit] = useState<'g' | 'kg' | 'ml' | 'pcs'>('g');
  const [rows, setRows] = useState<IngredientRow[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');

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

  const addDisabled = selectedIngredient === '' || amount === 0;

  return (
    <Stack gap={1}>
      <GradientTitle title="Hi there, user! What are you going to cook today?" />
      <Stack flexDirection={'row'} gap={1} justifyContent={'space-between'}>
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
      <IngredientDg rows={rows}></IngredientDg>
      <Stack flexDirection={'row'} gap={1} justifyContent={'flex-end'}>
        <Button
          variant="contained"
          startIcon={<AutoAwesomeIcon />}
          fullWidth={false}
        >
          Generate
        </Button>
      </Stack>
    </Stack>
  );
};
