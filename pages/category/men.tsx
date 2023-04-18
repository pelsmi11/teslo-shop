import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { useProducts } from "@/hooks";
import { Typography } from "@mui/material";

export default function MenPage() {
  const { products, isLoading, isError } = useProducts("/products?gender=men");
  return (
    <ShopLayout
      title="Teslo-Shop - Men"
      pageDescription="Encuentra los mejores productos de Teslo para ellos"
    >
      <Typography variant="h1" component={"h1"}>
        Hombres
      </Typography>
      <Typography variant="h2" component={"h2"} sx={{ mb: 1 }}>
        Productos para ellos
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
}
