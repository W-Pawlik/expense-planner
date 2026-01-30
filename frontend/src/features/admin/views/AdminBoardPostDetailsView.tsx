import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { usePendingBoardPostDetails } from "../hooks/usePendingBoardPostDetails";
import { useApproveBoardPost } from "../hooks/useApproveBoardPost";
import { useRejectBoardPost } from "../hooks/useRejectBoardPost";
import { FinancialProjectionChart } from "../../financial-groups/components/FinancialProjectionChart";
import { FinancialPositionsList } from "../../financial-groups/components/FinancialPositionsList";

export const AdminBoardPostDetailsView = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch, isFetching } =
    usePendingBoardPostDetails(postId);

  const approveMutation = useApproveBoardPost();
  const rejectMutation = useRejectBoardPost();

  const isBusy =
    isFetching || approveMutation.isPending || rejectMutation.isPending;

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

  if (!data) return null;

  const { post, group } = data;

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Pending plan</Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={() => refetch()}
            disabled={isBusy}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/board")}
            disabled={isBusy}
          >
            Back
          </Button>
        </Stack>
      </Stack>

      <Typography variant="h5" sx={{ mb: 1 }}>
        {group.name}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Submitted: {new Date(post.createdAt).toLocaleString()}
      </Typography>

      {group.description && (
        <Typography variant="body1" sx={{ mb: 3 }}>
          {group.description}
        </Typography>
      )}

      <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="success"
          disabled={isBusy}
          onClick={async () => {
            await approveMutation.mutateAsync(post.id);
            navigate("/admin/board");
          }}
        >
          Approve
        </Button>

        <Button
          variant="outlined"
          color="error"
          disabled={isBusy}
          onClick={async () => {
            await rejectMutation.mutateAsync(post.id);
            navigate("/admin/board");
          }}
        >
          Reject
        </Button>
      </Stack>

      <FinancialProjectionChart
        positions={group.positions ?? []}
        projectionYears={group.projectionYears}
        onProjectionChange={() => {}}
      />

      {/* read-only */}
      <FinancialPositionsList positions={group.positions ?? []} />
    </Box>
  );
};
