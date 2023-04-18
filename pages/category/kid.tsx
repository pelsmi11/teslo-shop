import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { useProducts } from "@/hooks";
import { Typography } from "@mui/material";

export default function KidPage() {
  const { products, isLoading, isError } = useProducts("/products?gender=kid");
  return (
    <ShopLayout
      title="Teslo-Shop - Kids"
      pageDescription="Encuentra los mejores productos de Teslo para niños"
    >
      <Typography variant="h1" component={"h1"}>
        Niños
      </Typography>
      <Typography variant="h2" component={"h2"} sx={{ mb: 1 }}>
        Productos para niños
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
}
