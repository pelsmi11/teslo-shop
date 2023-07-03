import { GetServerSideProps, NextPage } from "next";
import { CartList, OrderSummary } from "@/components/cart";
import { ShopLayout } from "@/components/layouts";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { dbOrders } from "@/database";
import { IOrder } from "@/interfaces";
import { countries } from "@/utils";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { tesloApi } from "@/api";
import { useRouter } from "next/router";
import { useState } from "react";

export type OrderResponseBody = {
  id: string;
  status:
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "PAYER_ACTION_REQUIRED"
    | "CREATED";
};

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
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

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== "COMPLETED") {
      return alert("No hay pago en Paypal");
    }
    setIsPaying(true);
    try {
      const { data } = await tesloApi.post(`/orders/pay`, {
        transactionId: details.id,
        orderId: order._id,
      });
      router.reload();
    } catch (error) {
      setIsPaying(false);
      console.log(error);
    }
  };
  return (
    <ShopLayout
      title={`Resumen de la orden ${_id}`}
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1" component={"h1"}>
        Orden: {_id}
      </Typography>
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

                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  className="fadeIn"
                  sx={{ display: isPaying ? "flex" : "none" }}
                >
                  <CircularProgress />
                </Box>

                <Box
                  flexDirection={"column"}
                  sx={{ display: isPaying ? "none" : "flex", flex: 1 }}
                >
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label="pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: `${order.total}`,
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          // console.log(details);
                          // const name = details.payer.name!.given_name;
                          onOrderCompleted(details);
                        });
                      }}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  res,
}) => {
  const { id = "" } = query;

  const session: any = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  if (order.user !== session.user.id) {
    return {
      redirect: {
        destination: `/orders/history`,
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

export default OrderPage;
