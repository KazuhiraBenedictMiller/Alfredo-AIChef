'use client';

import { Stack, Typography } from '@mui/material';
import { FaqAccordion } from '../common/faq-accordion';
import { useState } from 'react';

export const FaqSection = () => {
  const [expanded, setExpanded] = useState<string | false>('panel1');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <Stack gap={1} flex={1}>
      <Typography variant="h4" fontWeight={700} mb={2}>
        FAQ
      </Typography>
      <FaqAccordion
        id="panel1"
        title="How does Alfredo generate recipes?"
        subtitle="We use advanced AI algorithms to analyze your input and create personalized recipes based on flavor profiles, ingredients, and cooking styles."
        isExpanded={expanded === 'panel1'}
        onChange={handleChange}
      ></FaqAccordion>
      <FaqAccordion
        id="panel2"
        title="Can I specify dietary restrictions or preferences?"
        subtitle="We use advanced AI algorithms to analyze your input and create personalized recipes based on flavor profiles, ingredients, and cooking styles."
        isExpanded={expanded === 'panel2'}
        onChange={handleChange}
      ></FaqAccordion>
      <FaqAccordion
        id="panel3"
        title="Is Alfredo free to use?"
        subtitle="We use advanced AI algorithms to analyze your input and create personalized recipes based on flavor profiles, ingredients, and cooking styles."
        isExpanded={expanded === 'panel3'}
        onChange={handleChange}
      ></FaqAccordion>
    </Stack>
  );
};
