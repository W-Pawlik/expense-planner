import { Card, CardContent, Stack, Typography, Box, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footerText: string;
  footerLinkLabel: string;
  footerLinkTo: string;
};

export const AuthFormShell = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkLabel,
  footerLinkTo,
}: Props) => {
  return (
    <Box
      sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 6 }}
    >
      <Card sx={{ width: "100%", maxWidth: 420 }}>
        <CardContent>
          <Stack spacing={3}>
            <Stack spacing={0.5}>
              <Typography variant="h5">{title}</Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Stack>

            {children}

            <Typography variant="body2" color="text.secondary">
              {footerText}{" "}
              <Link component={RouterLink} to={footerLinkTo} underline="hover">
                {footerLinkLabel}
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
