'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';

// type Props = {};

export const RecipeBuilder = () => {
  const [ingredients, setIngredients] = useState<string>('');

  const { data, isError, error, isPending, mutateAsync } = useMutation({
    mutationFn: async () => {
      try {
        const { data } = await axios.post('/api/recipe', {
          ingredients,
        });
        return data;
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw new Error(err.message);
        }
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutateAsync();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Enter ingredients"
        />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Loading...' : 'Get Recipe'}
        </button>
      </form>
      {isError || (!data && <p style={{ color: 'red' }}>{error}</p>)}
      {data && { data }}
    </div>
  );
};
