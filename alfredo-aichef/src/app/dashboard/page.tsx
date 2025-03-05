'use client'
import { useState, FormEvent } from 'react';

export default  function Dashboard() {
  const [ingredients, setIngredients] = useState<string>('');
  const [recipe, setRecipe] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
    
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecipe('');
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

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (err: any) {
      console.error('Error fetching recipe:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Recipe'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {recipe && <pre>{recipe}</pre>}
    </div>
  );
}