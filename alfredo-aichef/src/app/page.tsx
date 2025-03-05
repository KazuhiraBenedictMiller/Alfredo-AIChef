import { Cta } from '@/components/feature/cta';
import { Box, Stack } from '@mui/material';
import Image from 'next/image';

export default async function LandingPage() {
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
