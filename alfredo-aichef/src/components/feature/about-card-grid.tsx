'use client';

import { Grid2, useMediaQuery } from '@mui/material';
import { AboutCard } from '../common/about-card';

export const AboutCardGrid = () => {
  const md = useMediaQuery('(max-width: 1235px)');
  return (
    <Grid2
      container
      size={{ xs: 12, sm: 6, md: 4 }}
      justifyContent={md ? 'center' : 'space-between'}
    >
      <AboutCard
        title="Tell us what you're craving"
        subtitle="Enter your prompt and let us know what you’re in the mood for."
        src="/1-about-card.png"
      ></AboutCard>
      <AboutCard
        title="Tell us what you're craving"
        subtitle="Enter your prompt and let us know what you’re in the mood for."
        src="/2-about-card.png"
      ></AboutCard>
      <AboutCard
        title="Tell us what you're craving"
        subtitle="Enter your prompt and let us know what you’re in the mood for."
        src="/3-about-card.png"
      ></AboutCard>
      <AboutCard
        title="Tell us what you're craving"
        subtitle="Enter your prompt and let us know what you’re in the mood for."
        src="/4-about-card.png"
      ></AboutCard>
      <AboutCard
        title="Tell us what you're craving"
        subtitle="Enter your prompt and let us know what you’re in the mood for."
        src="/5-about-card.png"
      ></AboutCard>
      <AboutCard
        title="Tell us what you're craving"
        subtitle="Enter your prompt and let us know what you’re in the mood for."
        src="/6-about-card.png"
      ></AboutCard>
    </Grid2>
  );
};
