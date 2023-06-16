import { ICartProduct } from "@/interfaces";
import { createContext } from "react";
import { shippingAddress } from "./CartProvider";

interface ContextProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: shippingAddress;

  addProductToCart: (product: ICartProduct) => void;
  updateCartQuantity: (product: ICartProduct) => void;
  removeCartProduct: (product: ICartProduct) => void;
  updateAddress: (address: shippingAddress) => void;
}

export const CartContext = createContext({} as ContextProps);
