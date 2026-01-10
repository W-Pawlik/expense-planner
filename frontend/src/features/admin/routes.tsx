import type { RouteObject } from "react-router-dom";
import { AdminBoardView } from "./views/AdminBoardView";
import { RequireAdmin } from "../auth/components/guards/RequireAdmin";

export const adminRoutes: RouteObject[] = [
  {
    element: <RequireAdmin />,
    children: [
      {
        path: "/admin/board",
        element: <AdminBoardView />,
      },
    ],
  },
];
