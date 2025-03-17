// import React from 'react'

// type Props = {}

// const useRecipeBuilder = (props: Props) => {
//   const [amount, setAmount] = useState<number>(0);
//     const [unit, setUnit] = useState<'g' | 'kg' | 'ml' | 'pcs'>('g');
//     const [rows, setRows] = useState<IngredientRow[]>([]);
//     const [selectedIngredient, setSelectedIngredient] = useState<string>('');

//     const handleAddRow = () => {
//       setRows([
//         ...rows,
//         {
//           id: rows.length + 1,
//           ingredient: selectedIngredient,
//           quantity: amount,
//           unit,
//         },
//       ]);
//       setSelectedIngredient('');
//       setAmount(0);
//     };

//     const handleReset = () => {
//       setRows([]);
//       setSelectedIngredient('');
//       setAmount(0);
//     };
//   return {

//   }
// }
