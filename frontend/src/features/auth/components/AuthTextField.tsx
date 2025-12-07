/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, type Control } from "react-hook-form";
import { TextField } from "@mui/material";

type Props = {
  name: string;
  control: Control<any>;
  label: string;
  type?: string;
  autoComplete?: string;
};

export const AuthTextField = ({
  name,
  control,
  label,
  type = "text",
  autoComplete,
}: Props) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          type={type}
          autoComplete={autoComplete}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          fullWidth
        />
      )}
    />
  );
};
