'use client';
import {
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';

type Props = {
  amount: number;
  setAmount: (amount: number) => void;
  unit: 'g' | 'kg' | 'ml' | 'pcs';
  setUnit: (unit: 'g' | 'kg' | 'ml' | 'pcs') => void;
};

export const QuantityTextField = ({
  amount,
  setAmount,
  unit,
  setUnit,
}: Props) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleUnitChange = (
    e: SelectChangeEvent<'g' | 'kg' | 'ml' | 'pcs'>
  ) => {
    setUnit(e.target.value as 'g' | 'kg' | 'ml' | 'pcs');
  };

  return (
    <TextField
      type="number"
      value={amount}
      onChange={handleAmountChange}
      sx={{ width: 150 }}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <Select
                value={unit}
                onChange={handleUnitChange}
                variant="standard"
                disableUnderline
                sx={{
                  minWidth: 20,
                }}
              >
                <MenuItem value="g">g</MenuItem>
                <MenuItem value="kg">kg</MenuItem>
                <MenuItem value="ml">ml</MenuItem>
                <MenuItem value="pcs">pcs</MenuItem>
              </Select>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};
