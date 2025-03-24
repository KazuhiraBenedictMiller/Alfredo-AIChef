'use client';
import { Box } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export interface IngredientRow {
  id: number;
  ingredient: string;
  quantity: number;
  unit: string;
}

type Props = {
  rows: IngredientRow[];
  setRows: (rows: IngredientRow[]) => void;
};

export const IngredientDg = ({ rows, setRows }: Props) => {
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
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<DeleteOutlineIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  return (
    <Box sx={{ height: 400, width: '100%', minWidth: 200, mt: 2 }}>
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
        disableRowSelectionOnClick
        disableColumnMenu
      />
    </Box>
  );
};
