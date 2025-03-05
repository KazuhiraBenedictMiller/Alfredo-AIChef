import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

type Props = {}

const RecipeBuilder = (props: Props) => {
  const [ingredients, setIngredients] = useState<string>('');
  const query = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch('/api/recipe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ingredients }),
        });
        console.log("response status:", response.status);

        if (!response.ok) {
          throw new Error('Failed to fetch recipe');
        }


        return await response.json();
      } catch (err: any) {
        console.error('Error fetching recipe:', err);

      }
    },
  })

return (
  <div>RecipeBuilder</div>
  )
}