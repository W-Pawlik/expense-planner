import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  ButtonGroup,
  Grid,
} from "@mui/material";
import { useState } from "react";

type Range = "1Y" | "5Y";

interface FinancialProjectionChartProps {
  currentMonthlyFlow?: number;
  projectedBalance1Y?: number;
  totalPositions?: number;
}

const formatCurrency = (value: number | undefined) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

export const FinancialProjectionChart = ({
  currentMonthlyFlow = 0,
  projectedBalance1Y = 0,
  totalPositions = 0,
}: FinancialProjectionChartProps) => {
  const [range, setRange] = useState<Range>("1Y");

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 1,
        p: 1,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="subtitle1">Financial Projection</Typography>
          <ButtonGroup size="small">
            <Button
              variant={range === "1Y" ? "contained" : "outlined"}
              onClick={() => setRange("1Y")}
            >
              1 Year
            </Button>
            <Button
              variant={range === "5Y" ? "contained" : "outlined"}
              onClick={() => setRange("5Y")}
            >
              5 Years
            </Button>
          </ButtonGroup>
        </Stack>

        <Box
          sx={{
            height: 260,
            borderRadius: 2,
            border: "1px dashed rgba(148,163,184,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
            fontSize: 14,
            mb: 3,
          }}
        >
          Chart placeholder ({range})
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                borderRadius: 1,
                px: 2,
                py: 1.5,
                bgcolor: "rgba(15,23,42,0.9)",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase" }}
              >
                Current Monthly Flow
              </Typography>
              <Typography variant="h6">
                {formatCurrency(currentMonthlyFlow)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                borderRadius: 1,
                px: 2,
                py: 1.5,
                bgcolor: "rgba(15,23,42,0.9)",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase" }}
              >
                Projected Balance (1 Year)
              </Typography>
              <Typography variant="h6">
                {formatCurrency(projectedBalance1Y)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                borderRadius: 1,
                px: 2,
                py: 1.5,
                bgcolor: "rgba(15,23,42,0.9)",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase" }}
              >
                Total Positions
              </Typography>
              <Typography variant="h6">{totalPositions}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
