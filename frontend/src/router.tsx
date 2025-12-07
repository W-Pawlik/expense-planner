import { BrowserRouter, useRoutes, type RouteObject } from "react-router-dom";
import { RootLayout } from "./core/layouts/RootLayout";

import { homeRoutes } from "./features/home/routes";
import { authRoutes } from "./features/auth/routes";
import { financialGroupsRoutes } from "./features/financial-groups/routes";
import { RequireAuth } from "./features/auth/components/guards/RequireAuth";
import { RequireGuest } from "./features/auth/components/guards/RequireGuest";

const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      {
        element: <RequireGuest />,
        children: [...homeRoutes, ...authRoutes],
      },
      {
        element: <RequireAuth />,
        children: [...financialGroupsRoutes],
      },
    ],
  },
];
const AppRoutes = () => useRoutes(routes);

export const AppRouter = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);
