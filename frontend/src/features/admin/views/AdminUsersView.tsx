import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Pagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
} from "@mui/material";
import MuiAlert, { type AlertProps } from "@mui/material/Alert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState } from "react";

import { useAdminUsers } from "../hooks/useAdminUsers";
import { useDeleteUser } from "../hooks/useDeleteUser";
import type { AdminUser } from "../types/adminUsers.types";

const SnackbarAlert = (props: AlertProps) => (
  <MuiAlert elevation={6} variant="filled" {...props} />
);

export const AdminUsersView = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error, isFetching } = useAdminUsers(
    page,
    limit
  );
  const deleteMutation = useDeleteUser();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("info");

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

  const isBusy = isFetching || deleteMutation.isPending;

  const openConfirm = (user: AdminUser) => {
    setSelectedUser(user);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteMutation.mutateAsync(selectedUser.id);
      setSnackbarMessage("User deleted.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      closeConfirm();
    } catch (e) {
      console.error(e);
      setSnackbarMessage("Failed to delete user. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  if (isLoading && !data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">{(error as Error).message}</Alert>;
  }

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Admin — Users</Typography>
        {isBusy && <CircularProgress size={24} />}
      </Stack>

      {users.length === 0 ? (
        <Alert severity="info">No users found.</Alert>
      ) : (
        <>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Login</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>
                    <Typography variant="body2" noWrap title={u.login}>
                      {u.login}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap title={u.email}>
                      {u.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="error"
                      disabled={isBusy || u.role === "ADMIN"} // opcjonalnie: nie pozwalaj usuwać admina
                      onClick={() => openConfirm(u)}
                      aria-label="delete user"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <Box mt={2} display="flex" justifyContent="center">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                color="primary"
                size="small"
              />
            </Box>
          )}
        </>
      )}

      <Dialog open={confirmOpen} onClose={closeConfirm}>
        <DialogTitle>Delete user?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone.
            {selectedUser ? ` Delete "${selectedUser.login}"?` : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm} disabled={deleteMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;
          setSnackbarOpen(false);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <SnackbarAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </SnackbarAlert>
      </Snackbar>
    </Box>
  );
};
