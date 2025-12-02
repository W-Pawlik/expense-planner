import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { theme } from "../assets/theme";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../redux/store";
import type { FC, PropsWithChildren } from "react";

export const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
};
