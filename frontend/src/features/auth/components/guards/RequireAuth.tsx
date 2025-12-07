import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserData } from "../../hooks/useUserData";

export const RequireAuth = () => {
  const { data: user, isLoading } = useUserData();
  const location = useLocation();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
