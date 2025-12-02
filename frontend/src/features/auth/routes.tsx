import type { RouteObject } from "react-router-dom";
import { LoginView } from "./views/LoginView";

export const authRoutes: RouteObject[] = [
  { path: "/login", element: <LoginView /> },
];
