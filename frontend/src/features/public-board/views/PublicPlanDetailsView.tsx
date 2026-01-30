import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Stack,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { usePublicPlanDetails } from "../hooks/usePublicPlanDetails";

// reuse Twoich komponentów:
import { FinancialProjectionChart } from "../../financial-groups/components/FinancialProjectionChart";
import { FinancialPositionsList } from "../../financial-groups/components/FinancialPositionsList";

export const PublicPlanDetailsView = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = usePublicPlanDetails(groupId);

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

  const { group, publishedAt } = data;
  const positions = group.positions ?? [];

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">{group.name}</Typography>
        <Button variant="outlined" onClick={() => navigate("/board")}>
          Back
        </Button>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Published: {new Date(publishedAt).toLocaleString()}
      </Typography>

      {group.description && (
        <Typography variant="body1" sx={{ mb: 3 }}>
          {group.description}
        </Typography>
      )}

      <FinancialProjectionChart
        positions={positions}
        projectionYears={group.projectionYears}
        onProjectionChange={() => {}}
      />

      {/* read-only: bez onAdd/onDelete */}
      <FinancialPositionsList positions={positions} />
    </Box>
  );
};
