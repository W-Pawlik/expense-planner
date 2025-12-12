import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFinancialGroups } from "../hooks/useFinancialGroups";
import { useCreateFinancialGroup } from "../hooks/useCreateFinancialGroup";
import { useUpdateFinancialGroup } from "../hooks/useUpdateFinancialGroup";
import { useDeleteFinancialGroup } from "../hooks/useDeleteFinancialGroup";

import { FinancialGroupTabs } from "../components/FinancialGroupTabs";
import { FinancialGroupSummaryCard } from "../components/FinancialGroupSummaryCard";
import { FinancialProjectionChart } from "../components/FinancialProjectionChart";
import { CreateFinancialGroupDialog } from "../components/CreateFinancialGroupDialog";
import type {
  FinancialGroupSummary,
  VisibilityStatus,
} from "../types/financialGroup.types";

export const FinancialGroupsView = () => {
  const { data, isLoading, isError, error } = useFinancialGroups();
  const createGroupMutation = useCreateFinancialGroup();
  const updateGroupMutation = useUpdateFinancialGroup();
  const deleteGroupMutation = useDeleteFinancialGroup();

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [visibilityDialogOpen, setVisibilityDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const groups: FinancialGroupSummary[] = data ?? [];

  useEffect(() => {
    if (!selectedGroupId && groups.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null;

  const handleAddGroupClick = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateGroup = (values: {
    name: string;
    projectionYears: number;
    visibilityStatus: VisibilityStatus;
  }) => {
    createGroupMutation.mutate(values, {
      onSuccess: (created) => {
        setCreateDialogOpen(false);
        setSelectedGroupId(created.id);
      },
    });
  };

  const handleUpdateGroup = (changes: {
    name: string;
    description?: string | null;
  }) => {
    if (!selectedGroup) return;
    updateGroupMutation.mutate({
      groupId: selectedGroup.id,
      changes,
    });
  };

  const handleVisibilityClick = () => {
    setVisibilityDialogOpen(true);
  };

  const handleConfirmVisibilityChange = () => {
    if (!selectedGroup) return;
    const nextStatus: VisibilityStatus =
      selectedGroup.visibilityStatus === "PUBLIC" ? "PRIVATE" : "PUBLIC";

    updateGroupMutation.mutate({
      groupId: selectedGroup.id,
      changes: { visibilityStatus: nextStatus },
    });

    setVisibilityDialogOpen(false);
  };

  const handleDeleteRequest = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedGroup) return;

    deleteGroupMutation.mutate(selectedGroup.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        // po usunięciu wybierz inną grupę (pierwszą z listy)
        const remaining = groups.filter((g) => g.id !== selectedGroup.id);
        setSelectedGroupId(remaining[0]?.id ?? null);
      },
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">{(error as Error).message}</Alert>;
  }

  if (!groups.length) {
    return (
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4">Financial Groups</Typography>
          <Button variant="contained" onClick={handleAddGroupClick}>
            Add group
          </Button>
        </Stack>
        <Alert severity="info">
          You don't have any groups yet. Create your first financial plan.
        </Alert>

        <CreateFinancialGroupDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateGroup}
          isSubmitting={createGroupMutation.isPending}
        />
      </Box>
    );
  }

  const isBusy =
    createGroupMutation.isPending ||
    updateGroupMutation.isPending ||
    deleteGroupMutation.isPending;

  return (
    <Box>
      <Stack spacing={3}>
        <FinancialGroupTabs
          groups={groups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={setSelectedGroupId}
          onAddGroup={handleAddGroupClick}
        />

        {selectedGroup && (
          <>
            <FinancialGroupSummaryCard
              group={selectedGroup}
              onUpdate={handleUpdateGroup}
              onDelete={handleDeleteRequest}
              onVisibilityClick={handleVisibilityClick}
              isBusy={isBusy}
            />

            {/* na razie mockujemy wartości */}
            <FinancialProjectionChart
              currentMonthlyFlow={2750}
              projectedBalance1Y={35750}
              totalPositions={5}
            />
          </>
        )}
      </Stack>

      {/* Dialog tworzenia */}
      <CreateFinancialGroupDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateGroup}
        isSubmitting={createGroupMutation.isPending}
      />

      {/* Dialog zmiany visibility */}
      <Dialog
        open={visibilityDialogOpen}
        onClose={() => setVisibilityDialogOpen(false)}
      >
        <DialogTitle>
          {selectedGroup?.visibilityStatus === "PUBLIC"
            ? "Make group private?"
            : "Publish group?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedGroup?.visibilityStatus === "PUBLIC"
              ? "This group will no longer be visible on the public board."
              : "This group may become visible on the public board (after approval if required). Are you sure you want to make it public?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVisibilityDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmVisibilityChange}
            variant="contained"
            disabled={updateGroupMutation.isPending}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete group?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. All positions and data in this group
            will be removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteGroupMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
