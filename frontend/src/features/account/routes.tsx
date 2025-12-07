import type { RouteObject } from "react-router-dom";
import { AccountView } from "./views/AccountView";
import { SettingsView } from "./views/SettingsView";

export const accountRoutes: RouteObject[] = [
  { path: "/account", element: <AccountView /> },
  { path: "/settings", element: <SettingsView /> },
];
