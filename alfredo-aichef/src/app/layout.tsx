import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider, UserButton } from '@clerk/nextjs';
import { Providers } from './providers';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

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
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <header>
            <UserButton showName />
          </header>
          <AppRouterCacheProvider>
            <InitColorSchemeScript attribute="class" />
            <Providers>
              <main style={{ height: '100vh' }}>{children}</main>
            </Providers>
          </AppRouterCacheProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
