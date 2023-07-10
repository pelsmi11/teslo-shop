import { useUiContext } from "@/hooks/useUiContext";
import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import NextLink from "next/link";

export const AdminNavbar = () => {
  const { toggleSideMenu } = useUiContext();

  return (
    <AppBar>
      <Toolbar>
        <NextLink href={"/"} style={{ textDecoration: "none" }}>
          <Link
            underline="always"
            component={"span"}
            sx={{ textDecoration: "none" }}
            display={"flex"}
            alignItems={"center"}
          >
            <Typography variant="h6">Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>
        <Box flex={1} />

        {/* pantallas desktop */}

        {/* pantallas pequeñas */}
        <Button onClick={toggleSideMenu}>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
