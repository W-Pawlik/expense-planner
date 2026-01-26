import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Pagination,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { PublicBoardPost } from "../types/publicBoard.types";

interface PublicBoardListProps {
  posts: PublicBoardPost[];
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;

  canHide?: (post: PublicBoardPost) => boolean;
  onHide?: (post: PublicBoardPost) => void;
  isHiding?: boolean;
}

export const PublicBoardList = ({
  posts,
  page,
  limit,
  total,
  onPageChange,
  canHide,
  onHide,
  isHiding,
}: PublicBoardListProps) => {
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const navigate = useNavigate();

  if (!posts.length) {
    return (
      <Typography variant="body1" color="text.secondary">
        No public plans have been published yet.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {posts.map((post) => (
        <Card
          key={post.id}
          onClick={() => navigate(`/board/${post.groupId}`)} // ✅ przejście do detali
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 1,
            border: "1px solid rgba(148,163,184,0.3)",
            cursor: "pointer",
            "&:hover": { borderColor: "primary.main" },
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 2,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                {/* ✅ NAZWA GRUPY, bez ID */}
                <Typography variant="subtitle1" gutterBottom>
                  {post.groupName}
                </Typography>

                {post.description && (
                  <Typography variant="body2" sx={{ mb: 1.5 }}>
                    {post.description}
                  </Typography>
                )}

                <Typography variant="caption" color="text.secondary">
                  Published: {new Date(post.createdAt).toLocaleString()}
                </Typography>
              </Box>

              {canHide?.(post) && (
                <Button
                  size="small"
                  color="warning"
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ żeby nie otwierało detali
                    onHide?.(post);
                  }}
                  disabled={isHiding}
                >
                  Hide
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          color="primary"
          page={page}
          count={pageCount}
          onChange={(_, newPage) => onPageChange(newPage)}
        />
      </Box>
    </Stack>
  );
};
