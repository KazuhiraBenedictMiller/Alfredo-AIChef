import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type Props = {
  id: string;
  title: string;
  subtitle: string;
  isExpanded: boolean;
  onChange: (
    panel: string
  ) => (event: React.SyntheticEvent, newExpanded: boolean) => void;
  defaultExpanded?: boolean;
};

export const FaqAccordion = ({
  id,
  title,
  subtitle,
  isExpanded,
  onChange,
  defaultExpanded = false,
}: Props) => {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      expanded={isExpanded}
      onChange={onChange(id)}
      sx={{ border: 'none', boxShadow: 'none' }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography color="primary" component="span" fontWeight={700}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ textAlign: 'start' }}>
        {subtitle}
      </AccordionDetails>
    </Accordion>
  );
};
