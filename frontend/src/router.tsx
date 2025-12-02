import { BrowserRouter, useRoutes } from "react-router-dom";
import { authRoutes } from "./features/auth/routes";
import { homeRoutes } from "./features/home/routes";

const AppRoutes = () => {
  const element = useRoutes([...homeRoutes, ...authRoutes]);
  return element;
};

export const AppRouter = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);
