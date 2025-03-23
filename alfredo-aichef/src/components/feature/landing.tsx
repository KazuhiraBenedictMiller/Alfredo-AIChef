'use client';

import { AboutCardGrid } from '@/components/feature/about-card-grid';
import { Cta } from '@/components/feature/cta';
import {
  Box,
  Container,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Image from 'next/image';
import { FaqSection } from '@/components/feature/faq-section';
import { useThemeContext } from '@/store/theme';

export const Landing = () => {
  const md = useMediaQuery('(max-width: 1235px)');
  const theme = useThemeContext();
  return (
    <>
      <Stack
        height={'100%'}
        flexDirection={md ? 'column' : 'row'}
        justifyContent={'center'}
        alignItems={'center'}
        pl={md ? 0 : 4}
      >
        <Cta />
        {md ? null : (
          <Box flex={1} height={'100%'} position={'relative'}>
            <Image
              src="/robot-landing.webp"
              alt="robot"
              fill
              style={{ objectFit: 'cover' }}
            />
          </Box>
        )}
        {md ? null : (
          <Box
            position={'absolute'}
            bottom={-20}
            left={0}
            height={220}
            width={'100%'}
            sx={{
              background:
                theme.mode === 'dark'
                  ? 'linear-gradient(0deg, var(--mui-palette-background-default) 29.92%, rgba(255, 255, 255, 0.00) 100%)'
                  : 'linear-gradient(0deg, #FFF 29.92%, rgba(255, 255, 255, 0.00) 100%)',
              boxShadow: `0px 4px 4px 0px rgba(0, 0, 0, 0)`,
            }}
          />
        )}
      </Stack>
      <Container maxWidth="lg" disableGutters sx={{ overflow: 'hidden' }}>
        <Stack mt={'50px'} p={4} height={'100%'} gap={4}>
          <Stack
            flexDirection={md ? 'column' : 'row'}
            width={'100%'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Image src="/alfredo.png" alt="robot" height={100} width={155} />
          </Stack>
          <Stack gap={1} textAlign={md ? 'center' : 'start'}>
            <Typography variant="h4" fontWeight={700}>
              Why choose Alfredo?
            </Typography>
            <Typography
              variant="h6"
              textAlign={'justify'}
              letterSpacing={'-1px'}
            >
              {
                "At Alfredo, we believe that cooking should be fun, effortless, and tailored to your cravings. Our AI-powered system transforms your ideas into delicious, easy-to-follow recipes in just a few clicks. Whether you're in the mood for comfort food, a healthy meal, or an experimental dish, we've got you covered!"
              }
            </Typography>
          </Stack>
          <Stack gap={1} textAlign={md ? 'center' : 'start'}>
            <Typography variant="h4" fontWeight={700} mb={2}>
              How does Alfredo work?
            </Typography>
            <AboutCardGrid></AboutCardGrid>
          </Stack>
          <Stack
            flexDirection={'row'}
            justifyContent={'space-between'}
            gap={2}
            flexWrap={'wrap'}
            textAlign={md ? 'center' : 'start'}
          >
            <FaqSection></FaqSection>
            {md ? null : <img src="/faq.png" alt="robot" style={{ flex: 1 }} />}
          </Stack>
        </Stack>
      </Container>
    </>
  );
};
