import { RecipeBuilder } from '@/components/feature/recipe-builder';
import { RecipeBuilderV2 } from '@/components/feature/recipe-builder-v2';
import { Grid2 } from '@mui/material';

export default async function Dashboard() {
  return (
    <Grid2
      container
      height={'100%'}
      justifyContent={'center'}
      px={'64px'}
      py={'96px'}
    >
      <Grid2 size={{ md: 12, lg: 6 }}>
        <RecipeBuilderV2 />
      </Grid2>
      <Grid2 size={{ md: 12, lg: 6 }}>
        <RecipeBuilder />
      </Grid2>
    </Grid2>
  );
}
