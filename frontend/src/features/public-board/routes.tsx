import type { RouteObject } from "react-router-dom";
import { PublicBoardView } from "./views/PublicBoardView";

export const publicBoardRoutes: RouteObject[] = [
  {
    path: "/board",
    element: <PublicBoardView />,
  },
];
