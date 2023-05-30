import "@/styles/globals.css";
import "react-slideshow-image/dist/styles.css";
import { AuthProvider, CartProvider, UiProvider } from "@/context";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme } from "@/themes";
import { SWRConfig } from "swr";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        // refreshInterval: 3000,
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <AuthProvider>
        <CartProvider>
          <UiProvider>
            <ThemeProvider theme={lightTheme}>
              <CssBaseline />
              <Component {...pageProps} />
            </ThemeProvider>
          </UiProvider>
        </CartProvider>
      </AuthProvider>
    </SWRConfig>
  );
}
