'use client';
import { useThemeContext } from '@/store/theme';
import { darkTheme, lightTheme } from '@/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type Props = {
  children: React.ReactNode;
};

const client = new QueryClient();

export const Providers = ({ children }: Props) => {
  const theme = useThemeContext();
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme?.mode === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};
