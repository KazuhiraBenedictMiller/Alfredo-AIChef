import { RecipeBuilderV2 } from '@/components/feature/dashboard/recipe-builder-v2';
import { Grid2 } from '@mui/material';
import AuthCheck from '@/components/common/auth-check';

export default async function Dashboard() {
  // const user = await auth();
  // if (!user) {
  //   return <RedirectToSignIn />
  // }
  return (
    <AuthCheck>
      <Grid2
        container
        height={'100%'}
        justifyContent={'center'}
        px={'64px'}
        py={'96px'}
        spacing={2}
      >
        <RecipeBuilderV2 />
      </Grid2>
    </AuthCheck>
  );
}
