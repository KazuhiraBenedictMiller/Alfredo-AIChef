'use client';
import {useThemeContext} from '@/store/theme';
import {MaterialUISwitch} from '../common/theme-button';
import {Button, Stack} from '@mui/material';
import {Logo} from './logo';
import Link from 'next/link';
import {SignedIn, SignedOut} from "@clerk/nextjs";

export const Header = () => {
    const theme = useThemeContext();

    const toggleTheme = (
        _: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) => {
        theme.set(checked ? 'dark' : 'light');
    };

    // todo need to handle clerk auth and components based on auth status (logged or not)

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
                    sx={{m: 1}}
                    checked={theme.mode === 'dark'}
                    onChange={toggleTheme}
                />
                <Link href="/auth/login">
                    <SignedIn>
                        <Button variant="outlined">Log out</Button>
                    </SignedIn>
                    <SignedOut>
                        <Button variant="outlined">Log in</Button>
                    </SignedOut>
                    
                </Link>
            </Stack>

            {/* <UserButton showName /> */}
        </Stack>
    );
};
