import type { RouteObject } from "react-router-dom";
import { LoginView } from "./components/LoginView";

export const authRoutes: RouteObject[] = [
  { path: "/login", element: <LoginView /> },
];
