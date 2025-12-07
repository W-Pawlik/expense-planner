import { Box, Typography } from "@mui/material";
import { ThemeToggleCard } from "../components/ThemeToggleCard";

export const SettingsView = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Settings
      </Typography>
      <ThemeToggleCard />
    </Box>
  );
};
