'use client';

import {
  Button,
  Stack,
  Typography,
  Card,
  CardContent,
  Grid2,
  IconButton,
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
  const { user } = useUser();
  const { get, set, handle, is, reset } = useRecipeBuilder();

  return (
    <>
      <Grid2 size={{ md: 12, lg: 6 }}>
        <GradientTitle
          title={`Hi there, ${user?.fullName}! What are you going to cook today?`}
        />
        <Stack
          flexDirection={'row'}
          justifyContent={'space-between'}
          // alignItems={'center'}
          mt={2}
          gap={1}
        >
          <Stack
            flexDirection={'row'}
            gap={1}
            justifyContent={'flex-start'}
            flexWrap={'wrap'}
          >
            <IngredientSelect
              options={ingredients}
              selected={get.selectedIngredient}
              setSelected={set.selectedIngredient}
            />
            <QuantityTextField
              amount={get.amount}
              setAmount={set.amount}
              unit={get.unit}
              setUnit={set.unit}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handle.addRow}
              disabled={is.addDisabled}
            >
              Add
            </Button>
          </Stack>
          <MealSelect
            selected={get.selectedMeal}
            setSelected={set.selectedMeal}
          />
        </Stack>

        <IngredientDg rows={get.rows} setRows={set.rows}></IngredientDg>
        <Stack
          flexDirection={'row'}
          gap={1}
          mt={2}
          justifyContent={'space-between'}
        >
          <Button onClick={reset} variant="outlined" color="error">
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<AutoAwesomeIcon />}
            onClick={handle.generateClick}
            disabled={is.dataPending || get.rows.length === 0}
          >
            {is.dataPending ? 'Loading...' : 'Generate'}
          </Button>
        </Stack>
      </Grid2>
      <Grid2 size={{ md: 12, lg: 6 }}>
        {is.dataPending ? (
          <RecipeLoader />
        ) : get.data ? (
          <Stack gap={2} mt={3}>
            <Stack flexDirection={'row'} justifyContent={'space-between'}>
              <Typography variant="h5">Recipes</Typography>
              <Stack flexDirection={'row'}>
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
