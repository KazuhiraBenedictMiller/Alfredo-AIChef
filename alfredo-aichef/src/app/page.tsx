import { Cta } from '@/components/feature/cta';
import { auth } from '@clerk/nextjs/server';
import { Box, Stack } from '@mui/material';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) return redirect('/dashboard');
  return (
    <Stack
      height={'100%'}
      flexDirection={'row'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Cta />
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
