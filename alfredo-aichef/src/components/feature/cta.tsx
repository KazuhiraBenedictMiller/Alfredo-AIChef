import { Button, Stack, Typography, useMediaQuery } from '@mui/material';
import { GradientTitle } from '../common/gradient-title';

export const Cta = () => {
  const md = useMediaQuery('(max-width: 1235px)');
  return (
    <Stack
      flex={1}
      height={'100%'}
      width={md ? '100%' : 36}
      alignItems={'center'}
      justifyContent={'center'}
      sx={{
        transform: md ? 'translateY(0)' : 'translateY(-5rem)',
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
