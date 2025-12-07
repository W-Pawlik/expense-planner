import { CircularProgress, Box } from "@mui/material";
import { useUserData } from "../../auth/hooks/useUserData";
import { Navigate } from "react-router-dom";
import { LandingPage } from "./LandingPage";

export const HomeView = () => {
  const { data: userData, isLoading } = useUserData();
  const token = localStorage.getItem("token");
  const shouldShowLoading = token && isLoading;

  if (shouldShowLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (userData) {
    return <Navigate to="/financialGroups" replace />;
  }

  return <LandingPage />;
};
