import * as React from 'react';
import Button from '@mui/material/Button';
import { Stack } from '@mui/material';

export const ButtonsTest = () => {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="text">Try it now</Button>
    </Stack>
  );
};
