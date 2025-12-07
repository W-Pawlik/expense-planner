import {
  Card,
  CardContent,
  Stack,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useThemeMode } from "../../../core/providers/ThemeModeProvider";

export const ThemeToggleCard = () => {
  const { mode, toggleMode } = useThemeMode();

  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">Theme</Typography>
          <FormControlLabel
            control={<Switch checked={mode === "dark"} onChange={toggleMode} />}
            label={mode === "dark" ? "Dark mode" : "Light mode"}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};
