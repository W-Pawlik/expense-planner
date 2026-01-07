/* eslint-disable prefer-const */
import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Slider,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import type { FinancialPosition } from "../types/financialPosition.types";

interface FinancialProjectionChartProps {
  positions: FinancialPosition[];
  projectionYears: number;
  onProjectionChange: (years: number) => void;
}

const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const FinancialProjectionChart = ({
  positions,
  projectionYears,
}: FinancialProjectionChartProps) => {
  const [projectionMonthsLocal, setProjectionMonthsLocal] = useState(() =>
    clamp(Math.round(projectionYears * 12), 1, 1200)
  );

  useEffect(() => {
    setProjectionMonthsLocal(clamp(Math.round(projectionYears * 12), 1, 1200));
  }, [projectionYears]);

  const { points, currentMonthlyFlow, projectedBalance1Y } = useMemo(() => {
    const today = startOfToday();

    const months = projectionMonthsLocal;
    const approxDays = Math.max(1, Math.round((months * 365) / 12)); // ~30.4d/m

    let recurringMonthly = 0;
    let oneTimeEvents: { date: Date; delta: number }[] = [];

    for (const p of positions) {
      const sign = p.positionType === "INCOME" ? 1 : -1;
      const baseDate = new Date(p.date);

      if (p.frequencyType === "RECURRING") {
        recurringMonthly += sign * p.amount;
      } else {
        oneTimeEvents.push({
          date: new Date(baseDate),
          delta: sign * p.amount,
        });
      }
    }

    const points: { date: Date; balance: number }[] = [];
    let balance = 0;

    for (let dayIndex = 0; dayIndex <= approxDays; dayIndex++) {
      const currentDate = addDays(today, dayIndex);

      for (const evt of oneTimeEvents) {
        if (isSameDay(evt.date, currentDate)) {
          balance += evt.delta;
        }
      }

      for (const p of positions) {
        if (p.frequencyType !== "RECURRING") continue;

        const sign = p.positionType === "INCOME" ? 1 : -1;
        const startDate = new Date(p.date);

        if (startDate > currentDate) continue;

        const sameDayOfMonth =
          startDate.getDate() === currentDate.getDate() || false;

        if (sameDayOfMonth) {
          balance += sign * p.amount;
        }
      }

      points.push({ date: currentDate, balance });
    }

    const oneYearDays = Math.min(365, approxDays);
    const projectedBalance1Y =
      points[oneYearDays]?.balance ?? points[points.length - 1]?.balance ?? 0;

    return {
      points,
      currentMonthlyFlow: recurringMonthly,
      projectedBalance1Y,
    };
  }, [positions, projectionMonthsLocal]);

  const xData = points.map((p) => p.date);
  const yData = points.map((p) => p.balance);

  const formatCurrency = (value: number) =>
    Math.abs(value).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  const totalPositions = positions.length;

  const handleSliderChange = (_: Event, value: number | number[]) => {
    setProjectionMonthsLocal(value as number);
  };

  // const handleSliderChangeCommitted = (_: Event, value: number | number[]) => {
  //   const months = value as number;
  //   const years = months / 12;
  //   onProjectionChange(years); // zapisujemy na backendzie
  // };

  const monthsLabel =
    projectionMonthsLocal < 12
      ? `${projectionMonthsLocal} month${projectionMonthsLocal > 1 ? "s" : ""}`
      : `${(projectionMonthsLocal / 12).toFixed(1)} years`;

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 1,
        p: 1,
      }}
    >
      <CardContent>
        <Stack spacing={2} mb={2}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="subtitle1">Financial Projection</Typography>
              <Typography variant="body2" color="text.secondary">
                Daily projection based on your positions
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
          </Stack>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Projection horizon: {monthsLabel}
            </Typography>
            <Slider
              min={1}
              max={1200} // 1m–100y
              value={projectionMonthsLocal}
              onChange={handleSliderChange}
              size="small"
              sx={{ maxWidth: 360 }}
            />
          </Box>
        </Stack>

        <Box sx={{ height: 260 }}>
          {points.length <= 1 ? (
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
                  scaleType: "time",
                  valueFormatter: (value) =>
                    new Date(value as Date).toLocaleDateString(),
                },
              ]}
              series={[
                {
                  id: "projection",
                  label: "Projected balance",
                  data: yData,
                  showMark: false,
                  area: false,
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
