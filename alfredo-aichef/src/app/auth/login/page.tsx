import { Box } from '@mui/material';
import { SignedOut, SignIn } from '@clerk/nextjs';

export default function Login() {
  return (
    <Box
      height={'100%'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <SignedOut>
        <SignIn routing="hash" />
      </SignedOut>
    </Box>
  );
}
