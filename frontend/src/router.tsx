import { BrowserRouter, useRoutes } from "react-router-dom";
import { authRoutes } from "./features/auth/routes";

const AppRoutes = () => {
  const element = useRoutes([...authRoutes]);
  return element;
};

export const AppRouter = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);
