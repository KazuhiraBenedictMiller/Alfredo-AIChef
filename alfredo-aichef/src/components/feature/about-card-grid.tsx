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
        title="Let Alfredo do the research"
        subtitle="Alfredo will do the beep-boop hard thinking. Hes an expert after all!"
        src="/2-about-card.png"
      ></AboutCard>
      <AboutCard
        title="AI at work"
        subtitle="Alfredo will refine his suggestions in the back-ground to ensure he delivers you top-tier results!"
        src="/3-about-card.png"
      ></AboutCard>
      <AboutCard
        title="Pick your delights"
        subtitle="Alfredo will hand deliver you a curated group of recipes to ensure your dinner finding struggles are over!"
        src="/4-about-card.png"
      ></AboutCard>
      <AboutCard
        title="Not what you were hoping for?"
        subtitle="You can ask Alfredo for a different selection! He’s really good, but"
        src="/5-about-card.png"
      ></AboutCard>
      <AboutCard
        title="Cook and enjoy"
        subtitle="You’ve made it this far! Enjoy your meal, we’re sure we will see you again!"
        src="/6-about-card.png"
      ></AboutCard>
    </Grid2>
  );
};
