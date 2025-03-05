import {Box} from '@mui/material';
import {SignedOut, SignedIn, SignInButton, SignUpButton, SignOutButton} from '@clerk/nextjs';

export default async function Login() {
    console.log('This is server side logic');
    return (
        <Box
            height={'100%'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
        >
            <SignedOut>
                <SignInButton/>
                <SignUpButton/>
            </SignedOut>
          
            <SignedIn>
                <SignOutButton/>
            </SignedIn>
        </Box>
    );
}
