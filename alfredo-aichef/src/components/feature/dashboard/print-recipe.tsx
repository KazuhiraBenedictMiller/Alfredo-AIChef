import React from 'react';
import { Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { RecipeIngredient } from './interfaces/recipe-interface';

interface PrintRecipeProps {
  recipe: RecipeIngredient;
  buttonVariant?: 'text' | 'outlined' | 'contained';
}

export const PrintRecipe: React.FC<PrintRecipeProps> = ({
  recipe,
  buttonVariant = 'contained',
}) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert(
        'Unable to open the print window. Please check your browser settings or disable popup blockers.'
      );
      return;
    }

    // Format ingredients correctly based on your data structure
    const ingredientsList = recipe.ingredients
      .map((ingredient) => {
        if (typeof ingredient === 'string') {
          return `<li>${ingredient}</li>`;
        }
        return `<li>${ingredient.quantity || ''} ${ingredient.unit || ''} ${
          ingredient.ingredient
        }</li>`;
      })
      .join('');

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${recipe.dish_name || 'Recipe'}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              color: #333;
              border-bottom: 2px solid #ddd;
              padding-bottom: 10px;
            }
            .recipe-meta {
              display: flex;
              justify-content: space-between;
              color: #666;
              margin-bottom: 20px;
            }
            .ingredients {
              background: #f9f9f9;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 20px;
            }
            .ingredients h2 {
              margin-top: 0;
            }
            .instructions {
              white-space: pre-wrap;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <h1>${recipe.dish_name || 'Recipe'}</h1>
          <div class="recipe-meta">
            <div>Prep time: ${recipe.prep_time}</div>
            <div>Cook time: ${recipe.cooking_time}</div>
          </div>
          
          <div class="ingredients">
            <h2>Ingredients</h2>
            <ul>
              ${ingredientsList}
            </ul>
          </div>
          
          <div class="instructions">
            <h2>Instructions</h2>
            <p>${recipe.cooking_instructions}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <Button
      variant={buttonVariant}
      startIcon={<PrintIcon />}
      onClick={handlePrint}
      aria-label="Print recipe"
    >
      Print
    </Button>
  );
};
