import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useMe } from "../hooks/useMe";
import { AccountDetailsCard } from "../components/AccountDetailsCard";

export const AccountView = () => {
  const { data, isLoading, isError, error } = useMe();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">{(error as Error).message}</Alert>;
  }

  if (!data) {
    return <Alert severity="info">No user data.</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Account
      </Typography>
      <AccountDetailsCard user={data} />
    </Box>
  );
};
