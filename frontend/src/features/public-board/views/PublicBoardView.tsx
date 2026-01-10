import { useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { usePublicBoard } from "../hooks/usePublicBoard";
import { PublicBoardList } from "../components/PublicBoardList";

const PAGE_SIZE = 10;

export const PublicBoardView = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = usePublicBoard(page, PAGE_SIZE);

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

  const posts = data?.posts ?? [];
  const total = data?.total ?? 0;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Public Board
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Browse approved financial plans shared by other users.
      </Typography>

      <PublicBoardList
        posts={posts}
        page={page}
        limit={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
      />
    </Box>
  );
};
