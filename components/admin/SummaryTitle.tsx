import { CreditCardOffOutlined } from "@mui/icons-material";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { FC } from "react";

interface Props {
  title: string | number;
  subTitle: string;
  icon: JSX.Element;
}

export const SummaryTitle: FC<Props> = ({ icon, subTitle, title }) => {
  return (
    <Grid item xs={12} sm={4} md={3}>
      <Card sx={{ display: "flex", border: "1px rgba(0,0,0,0.1) solid" }}>
        <CardContent
          sx={{
            width: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {icon}
        </CardContent>
        <CardContent
          sx={{
            flex: "1 0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h3">{title}</Typography>
          <Typography variant="caption">{subTitle}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};
