import { ShopLayout } from "@/components/layouts";
import { Chip, Grid, Link, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from "@mui/x-data-grid";
import NextLink from "next/link";
import React from "react";

interface RowProps {
  id: number;
  fullname: string;
  paid: boolean;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "fullname", headerName: "Nombre Completo", width: 300 },
  {
    field: "paid",
    headerName: "Pagada",
    description: "Muestra si la información está pagada la orden o no",
    width: 200,
    renderCell: (params: GridRenderCellParams<RowProps>) => {
      return params.row.paid ? (
        <Chip color="success" label="Pagada" variant="outlined" />
      ) : (
        <Chip color="error" label="No Pagada" variant="outlined" />
      );
    },
  },
  {
    field: "orden",
    headerName: "Ver orden",
    width: 200,
    sortable: false,
    renderCell: (params: GridRenderCellParams<RowProps>) => {
      return (
        <NextLink href={`/orders/${params.row.id}`} passHref>
          <Link component={"span"} underline="always">
            {" "}
            Ver Orden
          </Link>
        </NextLink>
      );
    },
  },
];

const rows: GridRowsProp = [
  { id: 1, paid: false, fullname: "Hello" },
  { id: 2, paid: true, fullname: "DataGridPro" },
  { id: 3, paid: false, fullname: "MUI" },
];

export default function HistoryPage() {
  return (
    <ShopLayout
      title="historial de ordenes"
      pageDescription="Historial de ordenes del cliente"
    >
      <Typography variant="h1" component="h1">
        Hitorial de ordenes
      </Typography>
      <Grid container>
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10]}
            autoPageSize
            // rowsPer
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
}
