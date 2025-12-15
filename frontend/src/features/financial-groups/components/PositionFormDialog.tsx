import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreatePositionInput } from "../models/createPosition.schema";
import { PositionSchema } from "../models/createPosition.schema";

interface PositionFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: Partial<CreatePositionInput>;
  onClose: () => void;
  onSubmit: (values: CreatePositionInput) => void;
  onDelete?: () => void;
  isSubmitting?: boolean;
}

export const PositionFormDialog = ({
  open,
  mode,
  initialValues,
  onClose,
  onSubmit,
  onDelete,
  isSubmitting,
}: PositionFormDialogProps) => {
  const { control, handleSubmit, reset } = useForm<CreatePositionInput>({
    resolver: zodResolver(PositionSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      amount: initialValues?.amount ?? 0,
      positionType: initialValues?.positionType ?? "INCOME",
      frequencyType: initialValues?.frequencyType ?? "RECURRING",
      notes: initialValues?.notes ?? "",
      category: initialValues?.category ?? "",
      interestRate: initialValues?.interestRate ?? undefined,
    },
  });

  React.useEffect(() => {
    if (!open) return;
    reset({
      name: initialValues?.name ?? "",
      amount: initialValues?.amount ?? 0,
      positionType: initialValues?.positionType ?? "INCOME",
      frequencyType: initialValues?.frequencyType ?? "RECURRING",
      notes: initialValues?.notes ?? "",
      category: initialValues?.category ?? "",
      interestRate: initialValues?.interestRate ?? undefined,
    });
  }, [initialValues, open, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (values: CreatePositionInput) => {
    onSubmit(values);
  };

  const title = mode === "create" ? "Add Position" : "Edit Position";

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Name"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="amount"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="number"
                label="Amount"
                fullWidth
                inputProps={{ step: 1 }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? "" : Number(value));
                }}
              />
            )}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
              name="positionType"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="Type"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                >
                  <MenuItem value="INCOME">Income</MenuItem>
                  <MenuItem value="EXPENSE">Expense</MenuItem>
                </TextField>
              )}
            />
            <Controller
              name="frequencyType"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="Frequency"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                >
                  <MenuItem value="RECURRING">Recurring</MenuItem>
                  <MenuItem value="ONE_TIME">One-time</MenuItem>
                </TextField>
              )}
            />
          </Stack>

          <Controller
            name="category"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Category"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="notes"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Notes"
                fullWidth
                multiline
                minRows={2}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="interestRate"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="number"
                label="Interest rate (%)"
                fullWidth
                inputProps={{ min: 0, max: 100, step: 0.1 }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? undefined : Number(value));
                }}
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        {mode === "edit" && onDelete && (
          <Button
            color="error"
            onClick={onDelete}
            disabled={isSubmitting}
            sx={{ mr: "auto" }}
          >
            Delete
          </Button>
        )}
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={isSubmitting}
        >
          {mode === "create" ? "Add" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
