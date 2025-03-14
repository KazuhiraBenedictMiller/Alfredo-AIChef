'use client';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

export interface IngredientRow {
  id: number;
  ingredient: string;
  quantity: number;
  unit: string;
}

const columns: GridColDef<IngredientRow[][number]>[] = [
  {
    field: 'ingredient',
    headerName: 'Ingredient',
    flex: 1,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    flex: 1,
    renderCell: (params) => {
      return params.value + params.row.unit;
    },
  },
];

// const rows:  = [
//   { id: 1, ingredient: 'Tomato', quantity: 20, unit: 'g' },
//   { id: 2, ingredient: 'Onion', quantity: 10, unit: 'g' },
//   { id: 3, ingredient: 'Garlic', quantity: 2, unit: 'pcs' },
//   { id: 4, ingredient: 'Ginger', quantity: 100, unit: 'g' },
//   { id: 5, ingredient: 'Chilli', quantity: 1, unit: 'kg' },
//   { id: 6, ingredient: 'Coriander', quantity: 10, unit: 'g' },
//   { id: 7, ingredient: 'Cumic', quantity: 1000, unit: 'ml' },
//   { id: 8, ingredient: 'Turmeric', quantity: 1, unit: 'g' },
//   { id: 9, ingredient: 'Basil', quantity: 10, unit: 'g' },
// ];

type Props = {
  rows: IngredientRow[];
};

export const IngredientDg = ({ rows }: Props) => {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnMenu
      />
    </Box>
  );
};
