import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SavingsIcon from "@mui/icons-material/Savings";
import AddIcon from "@mui/icons-material/Add";
import type { FinancialPosition } from "../types/financialPosition.types";

interface FinancialPositionsListProps {
  positions: FinancialPosition[];
  onAddPosition?: () => void;
  onDeletePosition?: (id: string) => void;
  onPositionClick?: (position: FinancialPosition) => void;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);

export const FinancialPositionsList = ({
  positions,
  onAddPosition,
  onDeletePosition,
  onPositionClick,
}: FinancialPositionsListProps) => {
  return (
    <Card
      sx={{
        borderRadius: 1,
        p: 1,
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Financial Positions
        </Typography>

        <Stack spacing={1.5}>
          {positions.map((p) => {
            const isIncome = p.positionType === "INCOME";
            const icon =
              p.category?.toLowerCase() === "savings" ? (
                <SavingsIcon fontSize="small" />
              ) : isIncome ? (
                <TrendingUpIcon fontSize="small" />
              ) : (
                <TrendingDownIcon fontSize="small" />
              );

            return (
              <Box
                key={p.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 1,
                  px: 2,
                  py: 1.5,
                  bgcolor: "rgba(15,23,42,0.9)",
                  cursor: onPositionClick ? "pointer" : "default",
                }}
                onClick={() => onPositionClick?.(p)}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  {icon}
                  <Box>
                    <Typography variant="subtitle2">{p.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {p.notes || p.category || "No description"}
                    </Typography>
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ minWidth: 180, justifyContent: "flex-end" }}
                >
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: isIncome ? "success.main" : "error.main",
                      }}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(Math.abs(p.amount))}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {p.frequencyType === "RECURRING" ? "Monthly" : "One-time"}
                    </Typography>
                  </Box>

                  {onDeletePosition && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePosition(p.id);
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
              </Box>
            );
          })}

          {onAddPosition && (
            <Box
              sx={{
                mt: 1,
                borderRadius: 1,
                px: 2,
                py: 1.5,
                border: "1px dashed rgba(148,163,184,0.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  borderColor: "primary.main",
                },
              }}
              onClick={onAddPosition}
            >
              <AddIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">Add New Position</Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
