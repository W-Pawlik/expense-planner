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
  IconButton,
  Stack,
  Pagination,
  Snackbar,
} from "@mui/material";
import MuiAlert, { type AlertProps } from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { usePendingBoardPosts } from "../hooks/usePendingBoardPosts";
import { useApproveBoardPost } from "../hooks/useApproveBoardPost";
import { useRejectBoardPost } from "../hooks/useRejectBoardPost";
import type { AdminBoardPost } from "../types/adminBoard.types";

const SnackbarAlert = (props: AlertProps) => (
  <MuiAlert elevation={6} variant="filled" {...props} />
);

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString();
};

export const AdminBoardView = () => {
  const [page, setPage] = useState(1); // 1-based
  const limit = 10;

  const { data, isLoading, isError, error, isFetching } = usePendingBoardPosts(
    page,
    limit
  );

  const approveMutation = useApproveBoardPost();
  const rejectMutation = useRejectBoardPost();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("info");

  const handleApprove = async (post: AdminBoardPost) => {
    try {
      await approveMutation.mutateAsync(post.id);
      setSnackbarMessage(
        "Post approved and will be visible on the public board."
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Failed to approve post. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleReject = async (post: AdminBoardPost) => {
    try {
      await rejectMutation.mutateAsync(post.id);
      setSnackbarMessage("Post rejected.");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Failed to reject post. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const total = data?.total ?? 0;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;
  const posts = data?.posts ?? [];

  const isBusy =
    isFetching || approveMutation.isPending || rejectMutation.isPending;

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
        <Typography variant="h4">Admin &mdash; Board moderation</Typography>
        {isBusy && <CircularProgress size={24} />}
      </Stack>

      {posts.length === 0 ? (
        <Alert severity="info">
          There are currently no posts waiting for approval.
        </Alert>
      ) : (
        <>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Group ID</TableCell>
                <TableCell>Author ID</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id} hover>
                  <TableCell>{post.groupId}</TableCell>
                  <TableCell>{post.authorId}</TableCell>
                  <TableCell sx={{ maxWidth: 320 }}>
                    <Typography
                      variant="body2"
                      noWrap
                      title={post.description ?? ""}
                    >
                      {post.description || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDateTime(post.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <IconButton
                        size="small"
                        color="success"
                        disabled={isBusy}
                        onClick={() => handleApprove(post)}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        disabled={isBusy}
                        onClick={() => handleReject(post)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Stack>
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
