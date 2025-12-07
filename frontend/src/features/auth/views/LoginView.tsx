import { Stack, Button, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthFormShell } from "../components/AuthFormShell";
import { AuthTextField } from "../components/AuthTextField";
import { useLogin } from "../hooks/useLogin";
import { type LoginFormValues, loginSchema } from "../models/login.schema";

export const LoginView = () => {
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onError: (err) => {
        const message = (err as Error).message ?? "Invalid login or password";
        setError("root", { type: "server", message });
      },
    });
  };

  return (
    <AuthFormShell
      title="Login"
      subtitle="Welcome back"
      footerText="Don't have an account?"
      footerLinkLabel="Register"
      footerLinkTo="/register"
    >
      <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
        <AuthTextField name="login" control={control} label="Login" />
        <AuthTextField
          name="password"
          control={control}
          label="Password"
          type="password"
        />

        {errors.root?.message && (
          <Alert severity="error">{errors.root.message}</Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loginMutation.isPending}
        >
          Sign in
        </Button>
      </Stack>
    </AuthFormShell>
  );
};
