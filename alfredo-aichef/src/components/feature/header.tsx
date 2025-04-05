'use client';
import { useThemeContext } from '@/store/theme';
import { MaterialUISwitch } from '../common/theme-button';
import { Button, Stack } from '@mui/material';
import { Logo } from './logo';
import {
  SignOutButton,
  useAuth,
} from '@clerk/nextjs';

export const Header = () => {
  const theme = useThemeContext();
  const { isSignedIn } = useAuth();

  const toggleTheme = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    theme.set(checked ? 'dark' : 'light');
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
      position={'fixed'}
      top={0}
      width={'100%'}
      zIndex={1000}
      bgcolor={'background.paper'}
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
            <Button href="/sign-in" variant="outlined">Sign In</Button>
            <Button href="/sign-up" variant="contained">Sign Up</Button>
          </Stack>
        ) : (
          <SignOutButton>
            <Button variant="contained">Sign out</Button>
          </SignOutButton>
        )}
      </Stack>

    </Stack>
  );
};
