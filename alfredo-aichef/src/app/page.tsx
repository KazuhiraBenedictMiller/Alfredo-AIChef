import { Box, Button, Stack, Typography } from '@mui/material';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <Stack
      height={'100%'}
      flexDirection={'row'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      {/* <Link href="/auth/login">
        <Button variant="contained">Login</Button>
      </Link>
      <ThemeButton /> */}
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
            background: 'linear-gradient(90deg, #020202 0%, #50E3C2 100%);',
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
      <Box flex={1} height={'100%'} position={'relative'}>
        <Image
          src="/robot-landing.svg"
          alt="robot"
          fill
          style={{ objectFit: 'cover' }}
        />
      </Box>
    </Stack>
  );
}
