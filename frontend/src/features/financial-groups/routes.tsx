import type { RouteObject } from "react-router-dom";
import { FinancialGroupsView } from "./views/FinancialGroupsView";

export const financialGroupsRoutes: RouteObject[] = [
  { path: "/financialGroups", element: <FinancialGroupsView /> },
];
