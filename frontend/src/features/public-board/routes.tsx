import type { RouteObject } from "react-router-dom";
import { PublicBoardView } from "./views/PublicBoardView";
import { PublicPlanDetailsView } from "./views/PublicPlanDetailsView";

export const publicBoardRoutes: RouteObject[] = [
  {
    path: "/board",
    element: <PublicBoardView />,
  },
  { path: "/board/:groupId", element: <PublicPlanDetailsView /> },
];
