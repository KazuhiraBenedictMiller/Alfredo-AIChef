import { ThemeButton } from '@/components/common/theme-button';
import { Box, Button } from '@mui/material';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <Box
      height={'100%'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Link href="/auth/login">
        <Button variant="contained">Login</Button>
      </Link>
      <ThemeButton />
    </Box>
  );
}
