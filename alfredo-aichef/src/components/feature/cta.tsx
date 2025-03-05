'use client';

import { useThemeContext } from '@/store/theme';
import { Button, Stack, Typography } from '@mui/material';

export const Cta = () => {
  const theme = useThemeContext();
  return (
    <Stack
      flex={1}
      height={'100%'}
      width={36}
      alignItems={'center'}
      justifyContent={'center'}
      sx={{
        transform: 'translateY(-10rem)',
      }}
      gap={2}
    >
      <Typography
        variant={'h2'}
        fontWeight={700}
        sx={{
          background:
            theme.mode === 'dark'
              ? 'linear-gradient(90deg, #FDFDFD -16.61%, #73FFE0 100%)'
              : 'linear-gradient(90deg, #020202 0%, #50E3C2 100%);',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
        }}
      >
        AI-Powered Chef Instant Recipes
      </Typography>
      <Typography variant={'h6'}>
        Your Pantry, Our Chef: Instant Recipes from what you have!
      </Typography>
      <Button variant="contained">Try it now</Button>
    </Stack>
  );
};
