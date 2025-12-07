import { Navigate, Outlet } from "react-router-dom";
import { useUserData } from "../../hooks/useUserData";

export const RequireGuest = () => {
  const { data: user, isLoading } = useUserData();
  const token = localStorage.getItem("token");

  if (token && isLoading) return null;

  if (user) {
    return <Navigate to="/financialGroups" replace />;
  }

  return <Outlet />;
};
