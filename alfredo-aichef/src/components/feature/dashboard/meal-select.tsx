'use client';
import { Autocomplete, TextField } from '@mui/material';

type Props = {
  selected: string;
  setSelected: (value: string) => void;
};

const staticOptions = [
  {
    label: 'Breakfast',
    value: 'breakfast',
  },
  {
    label: 'Lunch',
    value: 'lunch',
  },
  {
    label: 'Dinner',
    value: 'dinner',
  },
  {
    label: 'Snack',
    value: 'snack',
  },
  {
    label: 'Brunch',
    value: 'brunch',
  },
  {
    label: 'Supper',
    value: 'supper',
  },
  {
    label: 'Linner',
    value: 'linner',
  },
];

export const MealSelect = ({ selected, setSelected }: Props) => {
  return (
    <Autocomplete
      id="meal-select"
      sx={{ width: 300 }}
      options={staticOptions.sort((a, b) => a.label.localeCompare(b.label))}
      autoHighlight
      getOptionLabel={(option) => option.label}
      inputValue={selected}
      onInputChange={(event, newInputValue) => {
        setSelected(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Choose the meal" />
      )}
    />
  );
};
