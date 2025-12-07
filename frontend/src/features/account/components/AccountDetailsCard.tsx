import { Card, CardContent, Stack, Typography } from "@mui/material";
import type { User } from "../../auth/types/credentials";

export const AccountDetailsCard = ({ user }: { user: User }) => {
  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.secondary">
            Login
          </Typography>
          <Typography>{user.login}</Typography>

          <Typography variant="subtitle2" color="text.secondary">
            Email
          </Typography>
          <Typography>{user.email}</Typography>

          <Typography variant="subtitle2" color="text.secondary">
            Role
          </Typography>
          <Typography>{user.role}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
