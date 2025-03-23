import { Button, Stack, Typography } from '@mui/material';
import { GradientTitle } from '../common/gradient-title';

export const Cta = () => {
  return (
    <Stack
      flex={1}
      height={'100%'}
      width={36}
      alignItems={'center'}
      justifyContent={'center'}
      sx={{
        transform: 'translateY(-5rem)',
      }}
      gap={2}
    >
      <GradientTitle title="AI-Powered Chef Instant Recipes"></GradientTitle>
      <Typography variant={'h6'}>
        Your Pantry, Our Chef: Instant Recipes from what you have!
      </Typography>
      <Button variant="contained">Try it now</Button>
    </Stack>
  );
};
