import { AboutCardGrid } from '@/components/feature/about-card-grid';
import { Cta } from '@/components/feature/cta';
import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { FaqSection } from '@/components/feature/faq-section';

export default async function LandingPage() {
  return (
    <>
      <Stack
        height={'100%'}
        flexDirection={'row'}
        justifyContent={'center'}
        alignItems={'center'}
        pl={4}
      >
        <Cta />
        <Box flex={1} height={'100%'} position={'relative'}>
          <Image
            src="/robot-landing.svg"
            alt="robot"
            fill
            style={{ objectFit: 'cover' }}
          />
        </Box>
      </Stack>
      <Stack mt={'50px'} p={4} height={'100%'} gap={4}>
        <Stack flexDirection={'row'} width={'100%'} justifyContent={'center'}>
          <Image src="/alfredo.png" alt="robot" height={100} width={155} />
        </Stack>
        <Stack gap={1}>
          <Typography variant="h4" fontWeight={700}>
            Why choose Alfredo?
          </Typography>
          <Typography
            variant="body2"
            textAlign={'justify'}
            letterSpacing={'-1px'}
          >
            {
              "At Alfredo, we believe that cooking should be fun, effortless, and tailored to your cravings. Our AI-powered system transforms your ideas into delicious, easy-to-follow recipes in just a few clicks. Whether you're in the mood for comfort food, a healthy meal, or an experimental dish, we've got you covered!"
            }
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="h4" fontWeight={700} mb={2}>
            How does Alfredo work?
          </Typography>
          <AboutCardGrid></AboutCardGrid>
        </Stack>
        <Stack flexDirection={'row'} justifyContent={'space-between'} gap={2}>
          <FaqSection></FaqSection>
          <Image src="/faq.png" alt="robot" height={500} width={750} />
        </Stack>
      </Stack>
    </>
  );
}
