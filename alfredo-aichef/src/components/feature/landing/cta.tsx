import { Button, Stack, Typography, useMediaQuery } from '@mui/material';
import { GradientTitle } from '../../common/gradient-title';

export const Cta = () => {
  const md = useMediaQuery('(max-width: 1235px)');
  return (
    <Stack
      flex={1}
      height={md ? '60vh' : '100vh'}
      width={'100%'}
      alignItems={'center'}
      justifyContent={'center'}
      sx={{
        transform: md ? 'none' : 'translateY(-5rem)',
      }}
      gap={2}
    >
      <GradientTitle
        title="AI-Powered Chef Instant Recipes"
        textAlign={'center'}
      ></GradientTitle>
      <Typography variant={'h6'} textAlign={'center'}>
        Your Pantry, Our Chef: Instant Recipes from what you have!
      </Typography>
      <Button href="/dashboard" variant="contained">
        Try it now
      </Button>
    </Stack>
  );
};
