import { CartList, OrderSummary } from "@/components/cart";
import { ShopLayout } from "@/components/layouts";
import { useCartContext } from "@/hooks";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Cart() {
  const { isLoaded, numberOfItems, cart } = useCartContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && cart.length === 0) router.replace("/cart/empty");
  }, [isLoaded, cart, router]);

  // Para evitar que renderice cualquier cosa en el cliente
  if (!isLoaded) return <></>;

  if (isLoaded && cart.length === 0) {
    router.replace("/cart/empty");
    return null; // Evita el renderizado temporal del componente
  }

  return (
    <ShopLayout
      title={`Carrito ${numberOfItems > 0 ? "- " + numberOfItems : ""}`}
      pageDescription="Carrito de compras de la tienda"
    >
      <Typography variant="h1" component={"h1"}>
        Carrito
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList editable />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen ({numberOfItems} productos)
              </Typography>
              <Divider sx={{ my: 1 }} />
              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  href="/checkout/address"
                >
                  Checkout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
}
