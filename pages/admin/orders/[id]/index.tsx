import { CartList, OrderSummary } from "@/components/cart";
import { AdminLayout } from "@/components/layouts";
import { dbOrders } from "@/database";
import { IOrder } from "@/interfaces";
import { countries } from "@/utils";
import {
  AirplaneTicketOutlined,
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

interface Props {
  order: IOrder;
}

const PageAdminOrder: NextPage<Props> = ({ order }) => {
  const router = useRouter();
  const {
    _id,
    orderItems,
    isPaid,
    numberOfItems,
    shippingAddress,
    subTotal,
    total,
    tax,
  } = order;

  const country = countries.filter(
    (country) => country.code === shippingAddress.country
  )[0];
  return (
    <AdminLayout
      title="Resumen de la orden"
      subTitle={`OrdenId: ${_id}`}
      icon={<AirplaneTicketOutlined />}
    >
      {isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label="pagada"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label="Pendiente de pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}

      {/*  */}
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen ({numberOfItems}{" "}
                {numberOfItems > 1 ? "productos" : "producto"})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography variant="subtitle1">
                  Dirección de entrega
                </Typography>
              </Box>
              <Typography>{`${shippingAddress.firstName} ${shippingAddress.lastName}`}</Typography>
              <Typography>{shippingAddress.address}</Typography>
              {shippingAddress.address2 && (
                <Typography>{shippingAddress.address2}</Typography>
              )}
              <Typography>{shippingAddress.city}</Typography>
              <Typography>{country.name}</Typography>
              <Typography>{shippingAddress.phone}</Typography>
              <Divider sx={{ my: 1 }} />
              <OrderSummary
                orderValues={{ numberOfItems, subTotal, tax, total }}
              />
              <Box sx={{ mt: 3 }} display={"flex"} flexDirection={"column"}>
                {/* TODO: */}
                <Box display={"flex"} flexDirection={"column"}>
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2, flex: 1 }}
                      label="pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <Chip
                      sx={{ my: 2, flex: 1 }}
                      label="Pendiente de pago"
                      variant="outlined"
                      color="error"
                      icon={<CreditCardOffOutlined />}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  res,
}) => {
  const { id = "" } = query;

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/admin/orders`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default PageAdminOrder;
