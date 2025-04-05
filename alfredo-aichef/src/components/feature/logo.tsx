import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export const Logo = () => {
  return (
    <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
      <Stack flexDirection={'row'} alignItems={'center'}>
        <Image
          width={64}
          height={64}
          src="/logo.svg"
          alt="Alfredo logo"
          style={{
            cursor: 'pointer',
          }}
        />
        <Typography fontWeight={700} variant="h6">
          Alfredo
        </Typography>
      </Stack>
    </Link>
  );
};
