import { CartList, OrderSummary } from "@/components/cart";
import { ShopLayout } from "@/components/layouts";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import NextLink from "next/link";

export default function OrderPage() {
  return (
    <ShopLayout
      title="Resumen de la orden 1126481"
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1" component={"h1"}>
        Orden: ABC123
      </Typography>
      <Chip
        sx={{ my: 2 }}
        label="pagada"
        variant="outlined"
        color="success"
        icon={<CreditScoreOutlined />}
      />
      {/* <Chip
        sx={{ my: 2 }}
        label="Pendiente de pago"
        variant="outlined"
        color="error"
        icon={<CreditCardOffOutlined />}
      /> */}
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Orden</Typography>
              <Divider sx={{ my: 1 }} />

              <Box display={"flex"} justifyContent={"end"}>
                <NextLink href={"/checkout/address"} passHref>
                  <Link component={"span"} underline="always">
                    Editar
                  </Link>
                </NextLink>
              </Box>
              <Typography variant="subtitle1">Dirección de entrega</Typography>
              <Typography>Fernando Herrera</Typography>
              <Typography>323 Algun lugar</Typography>
              <Typography>sulivan p sherman callwe walabi</Typography>
              <Typography>sidney</Typography>
              <Typography>+1 10391274</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display={"flex"} justifyContent={"end"}>
                <NextLink href={"/cart"} passHref>
                  <Link component={"span"} underline="always">
                    Editar
                  </Link>
                </NextLink>
              </Box>
              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                {/* TODO: */}
                <h1>Pagar</h1>
                <Chip
                  sx={{ my: 2 }}
                  label="pagada"
                  variant="outlined"
                  color="success"
                  icon={<CreditScoreOutlined />}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
}
