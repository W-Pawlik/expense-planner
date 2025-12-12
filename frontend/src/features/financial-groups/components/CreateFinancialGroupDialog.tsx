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
import {
  CreateFinancialGroupSchema,
  type CreateFinancialGroupInput,
} from "../models/createFinancialGroup.schema";

interface CreateFinancialGroupDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateFinancialGroupInput) => void;
  isSubmitting?: boolean;
}

export const CreateFinancialGroupDialog = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateFinancialGroupDialogProps) => {
  const { control, handleSubmit, reset } = useForm<CreateFinancialGroupInput>({
    resolver: zodResolver(CreateFinancialGroupSchema),
    defaultValues: {
      name: "",
      projectionYears: 1,
      visibilityStatus: "PRIVATE",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (values: CreateFinancialGroupInput) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Financial Group</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Group name"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="projectionYears"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="number"
                label="Projection years"
                fullWidth
                inputProps={{ min: 1, max: 50 }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="visibilityStatus"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Visibility"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                <MenuItem value="PRIVATE">Private</MenuItem>
                <MenuItem value="PUBLIC">Public</MenuItem>
              </TextField>
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={isSubmitting}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
