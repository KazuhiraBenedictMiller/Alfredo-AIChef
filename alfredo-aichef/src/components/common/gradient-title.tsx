'use client';

import { useThemeContext } from '@/store/theme';
import { Typography } from '@mui/material';

type Props = {
  title: string;
};

export const GradientTitle = ({ title }: Props) => {
  const theme = useThemeContext();
  return (
    <Typography
      variant={'h3'}
      fontWeight={700}
      sx={{
        background:
          theme.mode === 'dark'
            ? 'linear-gradient(90deg, #FDFDFD -16.61%, #73FFE0 100%)'
            : 'linear-gradient(90deg, #020202 0%, #50E3C2 100%);',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center',
      }}
    >
      {title}
    </Typography>
  );
};
