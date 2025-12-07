import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { TopBar } from "./TopBar";

export const RootLayout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <TopBar />

      <Box
        component="main"
        sx={{
          width: "100%",
          flex: 1,
          pt: 3,
          pb: 4,
          px: { xs: 2, sm: 3, md: 4 },
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
