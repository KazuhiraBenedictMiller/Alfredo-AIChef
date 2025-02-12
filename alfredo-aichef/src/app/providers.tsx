'use client';
import { darkTheme, lightTheme } from '@/theme';
import { ThemeProvider, useMediaQuery } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
    noSsr: true,
  });
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');

  // Memoize the theme to avoid unnecessary recalculations on re-renders

  // Optionally, update the mode if the user's system settings change.
  useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  const theme = useMemo(
    () => (mode === 'light' ? lightTheme : darkTheme),
    [mode]
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
