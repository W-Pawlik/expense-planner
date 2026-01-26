import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { RequireAdmin } from "../auth/components/guards/RequireAdmin";
import { AdminPanelView } from "./views/AdminPanelView";
import { AdminBoardPostDetailsView } from "./views/AdminBoardPostDetailsView";

export const adminRoutes: RouteObject[] = [
  {
    element: <RequireAdmin />,
    children: [
      { path: "/admin", element: <Navigate to="/admin/board" replace /> },

      { path: "/admin/board", element: <AdminPanelView /> },
      { path: "/admin/users", element: <AdminPanelView /> },

      { path: "/admin/board/:postId", element: <AdminBoardPostDetailsView /> },
    ],
  },
];
