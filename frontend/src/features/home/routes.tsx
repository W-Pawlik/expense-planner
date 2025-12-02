import type { RouteObject } from "react-router-dom";
import { HomeView } from "./views/HomeView";

export const homeRoutes: RouteObject[] = [{ path: "/", element: <HomeView /> }];
