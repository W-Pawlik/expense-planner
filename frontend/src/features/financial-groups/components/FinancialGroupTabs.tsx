import { Box, Button, Paper, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { FinancialGroupSummary } from "../types/financialGroup.types";

interface FinancialGroupTabsProps {
  groups: FinancialGroupSummary[];
  selectedGroupId: string | null;
  onSelectGroup: (id: string) => void;
  onAddGroup: () => void;
}

export const FinancialGroupTabs = ({
  groups,
  selectedGroupId,
  onSelectGroup,
  onAddGroup,
}: FinancialGroupTabsProps) => {
  return (
    <Stack
      component={Paper}
      elevation={4}
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        p: 0.2,
        borderRadius: 0,
        borderTop: "1px solid rgba(148,163,184,0.2)",
        borderBottom: "1px solid rgba(148,163,184,0.2)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          p: 2,
        }}
      >
        {groups.map((group) => {
          const isActive = group.id === selectedGroupId;
          return (
            <Button
              key={group.id}
              size="small"
              variant={isActive ? "contained" : "outlined"}
              color={isActive ? "primary" : "inherit"}
              onClick={() => onSelectGroup(group.id)}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                px: 2.5,
                py: 0.5,
                borderColor: isActive
                  ? "transparent"
                  : "rgba(148, 163, 184, 0.6)",
                backgroundColor: isActive
                  ? "primary.main"
                  : "rgba(15,23,42,0.9)",
                "&:hover": {
                  backgroundColor: isActive
                    ? "primary.dark"
                    : "rgba(30, 41, 59, 0.9)",
                },
              }}
            >
              {group.name}
            </Button>
          );
        })}
      </Box>

      <Button
        size="small"
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={onAddGroup}
        sx={{
          borderRadius: 999,
          textTransform: "none",
          borderColor: "rgba(148, 163, 184, 0.6)",
        }}
      >
        Add Group
      </Button>
    </Stack>
  );
};
