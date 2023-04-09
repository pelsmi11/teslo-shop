import { SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import React from "react";

export const Navbar = () => {
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
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <NextLink href={"/category/men"} passHref>
            <Link component={"span"}>
              <Button>Hombres</Button>
            </Link>
          </NextLink>
          <NextLink href={"/category/women"} passHref>
            <Link component={"span"}>
              <Button>Mujeres</Button>
            </Link>
          </NextLink>
          <NextLink href={"/category/kid"} passHref>
            <Link component={"span"}>
              <Button>Niños</Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1} />
        <IconButton>
          <SearchOutlined />
        </IconButton>
        <NextLink href={"/cart"} passHref>
          <Link component={"span"}>
            <IconButton>
              <Badge badgeContent={2} color="secondary">
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>
        <Button>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
