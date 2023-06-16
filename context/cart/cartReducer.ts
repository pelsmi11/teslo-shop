import { ICartProduct } from "@/interfaces";
import { CartState, shippingAddress } from "./";

type CartActionType =
  | {
      type: "[Cart] - LoadCart from cookies | storage";
      payload: ICartProduct[];
    }
  | { type: "[Cart] - Update proudcts in cart"; payload: ICartProduct[] }
  | { type: "[Cart] - Change cart quantity"; payload: ICartProduct }
  | { type: "[Cart] - Remove product in cart"; payload: ICartProduct }
  | { type: "[Cart] - LoadAddress from cookies"; payload: shippingAddress }
  | { type: "[Cart] - Update address"; payload: shippingAddress }
  | {
      type: "[Cart] - Update order summary";
      payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
      };
    };

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case "[Cart] - LoadCart from cookies | storage":
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload],
      };
    case "[Cart] - Update proudcts in cart":
      return {
        ...state,
        cart: [...action.payload],
      };
    case "[Cart] - Change cart quantity":
      return {
        ...state,
        cart: state.cart.map((product) => {
          if (product._id !== action.payload._id) return product;
          if (product.size !== action.payload.size) return product;
          return action.payload;
        }),
      };
    case "[Cart] - Remove product in cart":
      return {
        ...state,
        cart: state.cart.filter(
          (product) =>
            !(
              product._id === action.payload._id &&
              product.size === action.payload.size
            )
        ),
        // cart: state.cart.filter((product) => {
        //   if (
        //     product._id === action.payload._id &&
        //     product.size === action.payload.size
        //   ) {
        //     return false;
        //   }
        //   return true;
        // }),
      };
    case "[Cart] - Update order summary":
      return {
        ...state,
        ...action.payload,
      };

    case "[Cart] - LoadAddress from cookies":
    case "[Cart] - Update address":
      return {
        ...state,
        shippingAddress: action.payload,
      };
    default:
      return state;
  }
};
