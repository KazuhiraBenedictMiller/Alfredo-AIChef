import { RecipeBuilderV2 } from '@/components/feature/dashboard/recipe-builder-v2';
import { Grid2, useTheme, useMediaQuery } from '@mui/material';
import AuthCheck from '@/components/common/auth-check';

export default function Dashboard() {
  return (
    <AuthCheck>
      <Grid2
        container
        height={'100%'}
        justifyContent={'center'}
        px={{ xs: '16px', sm: '32px', md: '64px' }} 
        py={{ xs: '64px', sm: '80px', md: '96px' }}
        spacing={{ xs: 1, sm: 2, md: 2 }}
      >
        <RecipeBuilderV2 />
      </Grid2>
    </AuthCheck>
  );
}
