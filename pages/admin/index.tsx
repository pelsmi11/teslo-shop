import { SummaryTitle } from "@/components/admin";
import { AdminLayout } from "@/components/layouts";
import { IDashboardSummaryResponse } from "@/interfaces";
import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from "@mui/icons-material";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useSWR from "swr";

const DashboardPage = () => {
  const { data, error, isValidating } = useSWR<IDashboardSummaryResponse>(
    "/api/admin/dashboard",
    {
      refreshInterval: 30 * 1000,
    }
  );

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    setRefreshIn(30);
  }, [isValidating]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn((refreshIn) => refreshIn - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!error && !data) {
    return <></>;
  }
  if (error) {
    console.log(error);
    return <Typography>Error al cargar la información</Typography>;
  }
  const {
    numberOfOrders,
    paidOrders,
    noPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  } = data!;

  return (
    <AdminLayout
      title="Dashboard"
      subTitle="Estadisticas generales"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTitle
          icon={
            <CreditCardOffOutlined color="secondary" sx={{ fontSize: 40 }} />
          }
          subTitle="Ordenes del producto"
          title={numberOfOrders}
        />
        <SummaryTitle
          icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
          subTitle="Ordenes pagadas"
          title={paidOrders}
        />
        <SummaryTitle
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
          subTitle="Ordenes pendientes"
          title={noPaidOrders}
        />
        <SummaryTitle
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
          subTitle="Ordenes clientes"
          title={numberOfClients}
        />
        <SummaryTitle
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
          subTitle="Productos"
          title={numberOfProducts}
        />
        <SummaryTitle
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
          subTitle="Productos sin existencias"
          title={productsWithNoInventory}
        />
        <SummaryTitle
          icon={
            <ProductionQuantityLimitsOutlined
              color="warning"
              sx={{ fontSize: 40 }}
            />
          }
          subTitle="Bajo inventario"
          title={lowInventory}
        />
        <SummaryTitle
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
          subTitle="Actualización en:"
          title={isValidating ? "🚀" : refreshIn}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
