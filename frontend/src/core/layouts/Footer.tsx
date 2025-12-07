import { Box, Divider, Stack, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ width: "100%", mt: "auto" }}>
      <Divider />
      <Box
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {year} Money Planner
        </Typography>

        <Stack direction="row" spacing={2}>
          <Link
            component={RouterLink}
            to="/"
            underline="hover"
            color="text.secondary"
            variant="body2"
          >
            Home
          </Link>
          <Link
            component={RouterLink}
            to="/board"
            underline="hover"
            color="text.secondary"
            variant="body2"
          >
            Public Board
          </Link>
          <Link
            component={RouterLink}
            to="/privacy"
            underline="hover"
            color="text.secondary"
            variant="body2"
          >
            Privacy
          </Link>
        </Stack>
      </Box>
    </Box>
  );
};
