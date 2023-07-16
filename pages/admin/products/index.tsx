import NextLink from "next/link";

import { AddOutlined, CategoryOutlined } from "@mui/icons-material";
import { Box, Button, CardMedia, Grid, Link } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from "@mui/x-data-grid";
import useSWR from "swr";

import { IProduct } from "@/interfaces";
import { AdminLayout } from "@/components/layouts";

const columns: GridColDef[] = [
  {
    field: "img",
    headerName: "Foto",
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <a href={`/product/${row.slug}`} target="_blank" rel="noreferrer">
          <CardMedia
            component={"img"}
            alt={row.title}
            className="fadeIn"
            image={row.img}
            // image={`/products/${row.img}`}
          />
        </a>
      );
    },
  },
  {
    field: "title",
    headerName: "Titulo",
    width: 250,
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <NextLink href={`/admin/products/${row.slug}`} passHref>
          <Link component={"span"} underline="always">
            {row.title}
          </Link>
        </NextLink>
      );
    },
  },
  { field: "gender", headerName: "Genero" },
  { field: "type", headerName: "Tipo" },
  { field: "inStock", headerName: "Inventario" },
  { field: "price", headerName: "Precio" },
  { field: "sizes", headerName: "Tallas", width: 250 },
];

const ProductsPage = () => {
  const { data, error } = useSWR<IProduct[]>("/api/admin/products");

  if (!data && !error) return <></>;

  const rows = data!.map((product) => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(", "),
    slug: product.slug,
  }));
  return (
    <AdminLayout
      title={`Productos (${data?.length || 0})`}
      subTitle="Mantenimiento de productos"
      icon={<CategoryOutlined />}
    >
      <Box display={"flex"} justifyContent={"end"} sx={{ mb: 2 }}>
        <Button
          startIcon={<AddOutlined />}
          color="secondary"
          href="/admin/products/new"
        >
          Crear Producto
        </Button>
      </Box>
      <Grid container className="fadeIn">
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
    </AdminLayout>
  );
};

export default ProductsPage;
