import { CartContext } from "@/context";
import { useContext } from "react";

export const useCartContext = () => {
  return useContext(CartContext);
};
