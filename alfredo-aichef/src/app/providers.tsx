'use client';
import { useThemeContext } from '@/store/theme';
import { darkTheme, lightTheme } from '@/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';

type Props = {
  children: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  const theme = useThemeContext();
  return (
    <ThemeProvider theme={theme?.mode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
};
