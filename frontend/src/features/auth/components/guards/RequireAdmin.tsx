import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserData } from "../../hooks/useUserData";

export const RequireAdmin = () => {
  const { data: userData, isLoading } = useUserData();
  const location = useLocation();

  if (isLoading) return null;
  if (!userData || userData.role !== "ADMIN") {
    return (
      <Navigate to="/financialGroups" state={{ from: location }} replace />
    );
  }

  return <Outlet />;
};
