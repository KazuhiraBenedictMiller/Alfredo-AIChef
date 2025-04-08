'use client';

import {
  Button,
  Stack,
  Typography,
  Card,
  CardContent,
  Grid2,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { IngredientSelect } from './ingredient-select';
import { QuantityTextField } from './quantity-textfield';
import { IngredientDg } from './ingredient-dg';
import { GradientTitle } from '../../common/gradient-title';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { RecipeLoader } from './recipe-loader';
import { ingredients } from '@/constants/ingredients';
import { useUser } from '@clerk/nextjs';
import { useRecipeBuilder } from './hooks/use-recipe-builder';
import { PrintRecipe } from './print-recipe';
import { MealSelect } from './meal-select';

export const RecipeBuilderV2 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user } = useUser();
  const { get, set, handle, is, reset } = useRecipeBuilder();

  return (
    <>
      <Grid2 size={{ xs: 12, md: 12, lg: 6 }}>
        <GradientTitle
          variant={isMobile ? "h5" : "h4"}
          title={`Hi there, ${user?.fullName || 'Chef'}! What are you going to cook today?`}
        />
        <Stack
          flexDirection={'column'}
          mt={2}
          gap={1}
        >
          <Stack
            flexDirection={isMobile ? 'column' : 'row'}
            gap={1}
            justifyContent={'flex-start'}
            alignItems={isMobile ? 'stretch' : 'center'}
            flexWrap={isMobile ? 'nowrap' : 'wrap'}
            width="100%"
          >
            <IngredientSelect
              options={ingredients}
              selected={get.selectedIngredient}
              setSelected={set.selectedIngredient}
            />
            
            <Stack 
              flexDirection={isMobile ? 'column' : 'row'} 
              width={isMobile ? '100%' : 'auto'}
              gap={1}
            >
              <QuantityTextField
                amount={get.amount}
                setAmount={set.amount}
                unit={get.unit}
                setUnit={set.unit}
              />
              <Button
                fullWidth={isMobile}
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handle.addRow}
                disabled={is.addDisabled}
              >
                Add
              </Button>
            </Stack>
          </Stack>
        </Stack>

        <IngredientDg rows={get.rows} setRows={set.rows}></IngredientDg>
        <Stack
          flexDirection={'row'}
          gap={1}
          mt={2}
          justifyContent={'space-between'}
        >
          <Button
            onClick={reset}
            variant="outlined"
            color="error"
            sx={{ maxHeight: 40 }}
          >
            Reset
          </Button>
          <Stack
            flexDirection={'row'}
            gap={1}
            justifyContent={'flex-end'}
            flexWrap={'wrap'}
          >
            <MealSelect
              selected={get.selectedMeal}
              setSelected={set.selectedMeal}
            />
            <Button
              variant="contained"
              startIcon={<AutoAwesomeIcon />}
              onClick={handle.generateClick}
              disabled={is.dataPending || get.rows.length === 0}
            >
              {is.dataPending ? 'Loading...' : 'Generate'}
            </Button>
          </Stack>
        </Stack>
      </Grid2>
      
      <Grid2 size={{ xs: 12, md: 12, lg: 6 }}>
        {is.dataPending ? (
          <RecipeLoader />
        ) : get.data ? (
          <Stack gap={2} mt={3}>
            <Stack flexDirection={'row'} justifyContent={'space-between'}>
              <Typography variant="h5">Recipes</Typography>
              <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
                <Typography variant="h6">
                  {`${get.selectedRecipe + 1}/${get?.data?.length}`}
                </Typography>
                <IconButton onClick={handle.prev} disabled={is.prevDisabled}>
                  <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
                </IconButton>
                <IconButton onClick={handle.next} disabled={is.nextDisabled}>
                  <ArrowForwardIosIcon stroke="4px"></ArrowForwardIosIcon>
                </IconButton>
              </Stack>
            </Stack>
            <Card sx={{ border: '1px solid #ccc', borderRadius: '8px' }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Typography variant="h6">
                    {get.data[get.selectedRecipe].dish_name}
                  </Typography>
                  <PrintRecipe
                    recipe={get.data[get.selectedRecipe]}
                    buttonVariant="outlined"
                  />
                </Stack>
                <Typography variant="subtitle1">Ingredients:</Typography>
                <ul>
                  {get.data[get.selectedRecipe].ingredients &&
                    get.data[get.selectedRecipe].ingredients.map(
                      (ingredient, i) => (
                        <li key={i}>
                          {typeof ingredient === 'string'
                            ? ingredient
                            : `${ingredient.quantity} of ${ingredient.ingredient}`}
                        </li>
                      )
                    )}
                </ul>
                <Typography variant="subtitle1">Instructions:</Typography>
                <Typography>
                  {get.data[get.selectedRecipe].cooking_instructions}
                </Typography>
                <Typography>
                  Prep Time: {get.data[get.selectedRecipe].prep_time}
                </Typography>
                <Typography>
                  Cooking Time: {get.data[get.selectedRecipe].cooking_time}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        ) : null}
      </Grid2>
    </>
  );
};
