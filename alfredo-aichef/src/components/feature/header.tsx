'use client';
import { useThemeContext } from '@/store/theme';
import { MaterialUISwitch } from '../common/theme-button';
import { Button, Stack } from '@mui/material';
import { Logo } from './logo';
import Link from 'next/link';
import { SignInButton, SignUpButton, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export const Header = () => {
  const theme = useThemeContext();
  const { isSignedIn, signOut } = useAuth();
  const router = useRouter();

  const toggleTheme = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    theme.set(checked ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <Stack
      height={'auto'}
      py={0.5}
      px={2}
      flexDirection={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      boxShadow={'0px 4px 4px 2px rgba(0, 0, 0, 0.08)'}
    >
      <Logo></Logo>
      <Stack flexDirection={'row'} alignItems={'center'}>
        <MaterialUISwitch
          sx={{ m: 1 }}
          checked={theme.mode === 'dark'}
          onChange={toggleTheme}
        />
        {!isSignedIn ? (
          <Stack direction={'row'} gap={1}>
            <SignInButton>
              <Button variant="outlined">Sign In</Button>
            </SignInButton>
            <SignUpButton>
              <Button variant="contained">Sign Up</Button>
            </SignUpButton>
          </Stack>
        ) : (
          <Link href="/auth/login">
            <Button variant="outlined" onClick={handleLogout}>
              Log out
            </Button>
          </Link>
        )}
      </Stack>

      {/* <UserButton showName /> */}
    </Stack>
  );
};
