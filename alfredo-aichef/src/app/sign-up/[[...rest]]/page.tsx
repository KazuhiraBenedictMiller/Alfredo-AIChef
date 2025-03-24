import { SignUp } from "@clerk/nextjs";
import { Grid2 } from '@mui/material';


export default function SignInPage() {
  return (
    <Grid2
      container
      height={'100%'}
      justifyContent={'center'}
      px={'64px'}
      py={'96px'}
      spacing={2}
    >
      <SignUp />

    </Grid2>
  );
}