'use client';

import { Stack } from '@mui/material';
import { Header } from './header';

type Props = {
  children: React.ReactNode;
};

// todo implement footer

export const Main = ({ children }: Props) => {
  return (
    <Stack height={'100vh'}>
      <Header></Header>
      <main style={{ height: '100vh', flex: 1 }}>{children}</main>
    </Stack>
  );
};
