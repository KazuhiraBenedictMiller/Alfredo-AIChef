import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Providers } from './providers';
import { ThemeProvider } from '@/store/theme';
import { Main } from '@/components/feature/main';

const inter = Inter({
  subsets: ['latin'],
  // This will generate a CSS variable: --font-inter
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Alfredo-AIChef',
  description: 'Your Pantry, Our Chef: Instant Recipes from what you have!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={inter.className}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <AppRouterCacheProvider>
            <ThemeProvider>
              <Providers>
                <Main>{children}</Main>
              </Providers>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
