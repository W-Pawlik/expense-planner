import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../redux/store";
import type { FC, PropsWithChildren } from "react";
import { ThemeModeProvider } from "./ThemeModeProvider";

export const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeModeProvider>{children}</ThemeModeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
};
