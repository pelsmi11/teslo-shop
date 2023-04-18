import { UiContext } from "@/context";
import { useContext } from "react";

export const useUiContext = () => {
  return useContext(UiContext);
};
