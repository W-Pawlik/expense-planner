import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Pagination,
  Button,
} from "@mui/material";
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
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 1,
            border: "1px solid rgba(148,163,184,0.3)",
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
                <Typography variant="subtitle1" gutterBottom>
                  Public plan #{post.groupId.slice(-6)}
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
                  onClick={() => onHide?.(post)}
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
