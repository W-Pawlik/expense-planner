import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminBoardView } from "./AdminBoardView";
import { AdminUsersView } from "./AdminUsersView";

const getActiveTab = (pathname: string) => {
  if (pathname.startsWith("/admin/users")) return "users";
  return "board";
};

export const AdminPanelView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const active = getActiveTab(location.pathname);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Admin panel
      </Typography>

      <Tabs
        value={active}
        onChange={(_, value) => {
          if (value === "board") navigate("/admin/board");
          if (value === "users") navigate("/admin/users");
        }}
        sx={{ mb: 3 }}
      >
        <Tab value="board" label="Board moderation" />
        <Tab value="users" label="Users" />
      </Tabs>

      {active === "board" ? <AdminBoardView /> : <AdminUsersView />}
    </Box>
  );
};
