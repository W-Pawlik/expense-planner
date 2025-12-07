import { Stack, Button, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthFormShell } from "../components/AuthFormShell";
import { AuthTextField } from "../components/AuthTextField";
import { useRegister } from "../hooks/useRegister";
import {
  registerSchema,
  type RegisterFormValues,
} from "../models/register.schema";

export const RegisterView = () => {
  const registerMutation = useRegister();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      login: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values, {
      onError: (err) => {
        const message = (err as Error).message ?? "Registration failed";
        setError("root", { type: "server", message });
      },
    });
  };

  return (
    <AuthFormShell
      title="Register"
      subtitle="Create your account"
      footerText="Already have an account?"
      footerLinkLabel="Login"
      footerLinkTo="/login"
    >
      <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
        {errors.root?.message && (
          <Alert severity="error">{errors.root.message}</Alert>
        )}

        <AuthTextField name="login" control={control} label="Login" />
        <AuthTextField
          name="email"
          control={control}
          label="Email"
          type="email"
        />
        <AuthTextField
          name="password"
          control={control}
          label="Password"
          type="password"
        />
        <AuthTextField
          name="confirmPassword"
          control={control}
          label="Confirm password"
          type="password"
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={registerMutation.isPending}
        >
          Create account
        </Button>
      </Stack>
    </AuthFormShell>
  );
};
