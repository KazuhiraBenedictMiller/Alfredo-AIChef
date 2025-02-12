'use client';
import { darkTheme, lightTheme } from '@/theme';
import { ThemeProvider, useMediaQuery } from '@mui/material';
// import { useEffect, useMemo, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
    defaultMatches: false,
    noSsr: true,
  });

  // Optionally, update the mode if the user's system settings change.
  // useEffect(() => {
  //   setMode(prefersDarkMode ? 'dark' : 'light');
  // }, [prefersDarkMode]);

  return (
    <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
      {children}
    </ThemeProvider>
  );
};
