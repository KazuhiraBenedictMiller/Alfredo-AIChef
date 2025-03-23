'use client';

import { Divider, Stack, Typography } from '@mui/material';
import Image from 'next/image';

type Props = {
  title: string;
  subtitle: string;
  src: string;
};

export const AboutCard = ({ title, subtitle, src }: Props) => {
  return (
    <Stack p={1} height={168}>
      <Divider />
      <Stack
        flexDirection={'row'}
        width={'100%'}
        height={'100%'}
        justifyContent={'center'}
        alignItems={'center'}
        gap={2}
      >
        <Image src={src} alt="robot" height={80} width={80} />
        <Stack gap={1} justifyContent={'center'}>
          <Typography variant="h6" color="primary" fontWeight={700}>
            {title}
          </Typography>
          <Typography
            variant="subtitle1"
            textAlign={'justify'}
            letterSpacing={'-1px'}
          >
            {subtitle}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
