/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  ButtonGroup,
  Button,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import type { FinancialPosition } from "../types/financialPosition.types";

type Range = "ALL" | "1Y" | "5Y";

interface FinancialProjectionChartProps {
  positions: FinancialPosition[];
  projectionYears: number;
}

export const FinancialProjectionChart = ({
  positions,
  projectionYears,
}: FinancialProjectionChartProps) => {
  const [range, setRange] = useState<Range>("ALL");

  const { points, currentMonthlyFlow, projectedBalance1Y } = useMemo(() => {
    let recurringMonthly = 0;
    let oneTimeNet = 0;

    for (const p of positions) {
      const sign = p.positionType === "INCOME" ? 1 : -1;

      if (p.frequencyType === "RECURRING") {
        recurringMonthly += sign * p.amount;
      } else {
        oneTimeNet += sign * p.amount;
      }
    }

    const years = Math.max(1, projectionYears || 1);

    const pts: { year: number; balance: number }[] = [];
    let balance = 0;

    // rok 0 – stan "dziś"
    pts.push({ year: 0, balance: 0 });

    for (let year = 1; year <= years; year++) {
      // co rok dodajemy 12 * miesięczny przepływ
      balance += recurringMonthly * 12;

      // jednorazowe zdarzenia wrzucamy w rok 1
      if (year === 1) {
        balance += oneTimeNet;
      }

      pts.push({ year, balance });
    }

    const y1 = pts.find((p) => p.year === 1)?.balance ?? 0;

    return {
      points: pts,
      currentMonthlyFlow: recurringMonthly,
      projectedBalance1Y: y1,
    };
  }, [positions, projectionYears]);

  const totalPositions = positions.length;

  const filteredPoints = useMemo(() => {
    if (range === "1Y") {
      return points.filter((p) => p.year <= 1);
    }
    if (range === "5Y") {
      return points.filter((p) => p.year <= Math.min(5, projectionYears));
    }
    return points;
  }, [points, range, projectionYears]);

  const xData = filteredPoints.map((p) => p.year);
  const yData = filteredPoints.map((p) => p.balance);

  const formatCurrency = (value: number) =>
    Math.abs(value).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

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
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
          mb={2}
        >
          <Box>
            <Typography variant="subtitle1">Financial Projection</Typography>
            <Typography variant="body2" color="text.secondary">
              Based on your current positions
            </Typography>
          </Box>

          <Stack direction="row" spacing={3}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Current monthly flow
              </Typography>
              <Typography variant="subtitle2">
                {currentMonthlyFlow >= 0 ? "+" : "-"}
                {formatCurrency(currentMonthlyFlow)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Projected balance (1Y)
              </Typography>
              <Typography variant="subtitle2">
                {projectedBalance1Y >= 0 ? "+" : "-"}
                {formatCurrency(projectedBalance1Y)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Total positions
              </Typography>
              <Typography variant="subtitle2">{totalPositions}</Typography>
            </Box>
          </Stack>

          <ButtonGroup size="small">
            <Button
              variant={range === "ALL" ? "contained" : "outlined"}
              onClick={() => setRange("ALL")}
            >
              All
            </Button>
            <Button
              variant={range === "1Y" ? "contained" : "outlined"}
              onClick={() => setRange("1Y")}
            >
              1Y
            </Button>
            <Button
              variant={range === "5Y" ? "contained" : "outlined"}
              onClick={() => setRange("5Y")}
              disabled={projectionYears < 5}
            >
              5Y
            </Button>
          </ButtonGroup>
        </Stack>

        <Box sx={{ height: 260 }}>
          {filteredPoints.length <= 1 ? (
            <Box
              sx={{
                height: "100%",
                borderRadius: 2,
                border: "1px dashed rgba(148,163,184,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
                fontSize: 14,
              }}
            >
              Add more positions to see projection
            </Box>
          ) : (
            <LineChart
              xAxis={[
                {
                  data: xData,
                  label: "Years",
                  valueFormatter: (v: any) => `${v}Y`,
                },
              ]}
              series={[
                {
                  id: "projection",
                  label: "Projected balance",
                  data: yData,
                  showMark: true,
                  area: true,
                },
              ]}
              height={260}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
