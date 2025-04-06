'use client';

import { createContext, useState, useContext, useMemo, useEffect } from 'react';

const ThemeContext = createContext<{
  mode: string;
  set: React.Dispatch<React.SetStateAction<string>>;
}>({
  mode: 'dark',
  set: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: Props) => {
  const [themeMode, setThemeMode] = useState<string>('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setThemeMode(localStorage.getItem('theme') || 'dark');
    }
  }, [localStorage]);

  const contextValue = useMemo(
    () => ({ mode: themeMode, set: setThemeMode }),
    [themeMode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
