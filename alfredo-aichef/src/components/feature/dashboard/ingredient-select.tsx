'use client';
import { Autocomplete, TextField, useMediaQuery, useTheme } from '@mui/material';

type Props = {
  options: { label: string; value: string }[];
  selected: string;
  setSelected: (value: string) => void;
};

export const IngredientSelect = ({ options, selected, setSelected }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Autocomplete
      id="ingredients-select"
      sx={{ width: isMobile ? '100%' : 300 }}
      options={options.sort((a, b) => a.label.localeCompare(b.label))}
      autoHighlight
      getOptionLabel={(option) => option.label}
      inputValue={selected}
      onInputChange={(event, newInputValue) => {
        setSelected(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Choose an ingredient" />
      )}
    />
  );
};
