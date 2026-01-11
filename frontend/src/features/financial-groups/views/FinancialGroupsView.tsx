/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Snackbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { FinancialPositionsList } from "../components/FinancialPositionsList";

import { useFinancialGroupDetails } from "../hooks/useFinancialGroupDetails";
import { useCreatePosition } from "../hooks/useCreatePosition";
import { useUpdatePosition } from "../hooks/useUpdatePosition";
import { useDeletePosition } from "../hooks/useDeletePosition";
import type { FinancialPosition } from "../types/financialPosition.types";
import type { CreatePositionInput } from "../models/createPosition.schema";
import { PositionFormDialog } from "../components/PositionFormDialog";
import { boardUserService } from "../../public-board/services/boardUserService";
import { useChangeGroupVisibility } from "../hooks/useChangeGroupVisibility";
import { financialGroupsQueryKeys } from "../consts/financialGroupsQueryKeys";

export const FinancialGroupsView = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useFinancialGroups();
  const createGroupMutation = useCreateFinancialGroup();
  const updateGroupMutation = useUpdateFinancialGroup();
  const deleteGroupMutation = useDeleteFinancialGroup();
  const changeVisibilityMutation = useChangeGroupVisibility();

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [visibilityDialogOpen, setVisibilityDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isVisibilityChanging, setIsVisibilityChanging] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [positionDialogOpen, setPositionDialogOpen] = useState(false);
  const [positionDialogMode, setPositionDialogMode] = useState<
    "create" | "edit"
  >("create");
  const [editingPosition, setEditingPosition] =
    useState<FinancialPosition | null>(null);

  const groups: FinancialGroupSummary[] = data ?? [];

  useEffect(() => {
    if (!selectedGroupId && groups.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  const selectedGroupFromList =
    groups.find((g) => g.id === selectedGroupId) ?? null;

  const { data: groupDetails } = useFinancialGroupDetails(selectedGroupId);

  const selectedGroup = groupDetails ?? selectedGroupFromList;

  const positions: FinancialPosition[] = groupDetails?.positions ?? [];

  let currentMonthlyFlow = 0;
  let projectedBalance1Y = 0;
  const totalPositions = positions.length;

  if (positions.length > 0) {
    let recurringFlow = 0;
    let oneTimeDelta = 0;

    for (const p of positions) {
      const sign = p.positionType === "INCOME" ? 1 : -1;
      if (p.frequencyType === "RECURRING") {
        recurringFlow += sign * p.amount;
      } else {
        oneTimeDelta += sign * p.amount;
      }
    }

    currentMonthlyFlow = recurringFlow;
    projectedBalance1Y = recurringFlow * 12 + oneTimeDelta;
  }

  const createPositionMutation = useCreatePosition(selectedGroupId);
  const updatePositionMutation = useUpdatePosition(selectedGroupId);
  const deletePositionMutation = useDeletePosition(selectedGroupId);

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

  const handleConfirmVisibilityChange = async () => {
    if (!selectedGroup) return;

    const nextStatus: VisibilityStatus =
      selectedGroup.visibilityStatus === "PUBLIC" ? "PRIVATE" : "PUBLIC";

    try {
      await changeVisibilityMutation.mutateAsync({
        groupId: selectedGroup.id,
        visibilityStatus: nextStatus,
      });

      queryClient.refetchQueries({
        queryKey: financialGroupsQueryKeys.details(selectedGroup.id),
      });

      if (nextStatus === "PUBLIC") {
        setSnackbarMessage(
          "Your group is now public and will appear on the public board after admin approval."
        );
      } else {
        setSnackbarMessage(
          "Your group is now private and hidden from the public board."
        );
      }

      setSnackbarOpen(true);
      setVisibilityDialogOpen(false);
    } catch (err) {
      console.error("Failed to change visibility", err);
      setSnackbarMessage("Could not change visibility. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteRequest = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedGroup) return;

    deleteGroupMutation.mutate(selectedGroup.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        const remaining = groups.filter((g) => g.id !== selectedGroup.id);
        setSelectedGroupId(remaining[0]?.id ?? null);
      },
    });
  };

  const handleAddPosition = () => {
    setEditingPosition(null);
    setPositionDialogMode("create");
    setPositionDialogOpen(true);
  };

  const handlePositionClick = (position: FinancialPosition) => {
    setEditingPosition(position);
    setPositionDialogMode("edit");
    setPositionDialogOpen(true);
  };

  const handleSubmitPosition = (values: CreatePositionInput) => {
    if (!selectedGroupId) return;

    if (positionDialogMode === "create") {
      createPositionMutation.mutate(values, {
        onSuccess: () => setPositionDialogOpen(false),
      });
    } else if (positionDialogMode === "edit" && editingPosition) {
      updatePositionMutation.mutate(
        { positionId: editingPosition.id, changes: values },
        { onSuccess: () => setPositionDialogOpen(false) }
      );
    }
  };

  const handleDeletePosition = (positionId: string) => {
    deletePositionMutation.mutate(positionId);
  };

  const handleDeletePositionFromDialog = () => {
    if (!editingPosition) return;
    deletePositionMutation.mutate(editingPosition.id, {
      onSuccess: () => setPositionDialogOpen(false),
    });
  };

  const isBusy =
    createGroupMutation.isPending ||
    updateGroupMutation.isPending ||
    deleteGroupMutation.isPending ||
    createPositionMutation.isPending ||
    updatePositionMutation.isPending ||
    deletePositionMutation.isPending ||
    isVisibilityChanging ||
    changeVisibilityMutation.isPending;

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
          <Box px={10}>
            <FinancialGroupSummaryCard
              group={selectedGroup}
              onUpdate={handleUpdateGroup}
              onDelete={handleDeleteRequest}
              onVisibilityClick={handleVisibilityClick}
              isBusy={isBusy}
            />

            <FinancialProjectionChart
              positions={positions}
              projectionYears={selectedGroup.projectionYears}
              onProjectionChange={(years) => {
                if (!selectedGroup) return;
                updateGroupMutation.mutate({
                  groupId: selectedGroup.id,
                  changes: { projectionYears: years },
                });
              }}
            />

            <FinancialPositionsList
              positions={positions}
              onAddPosition={handleAddPosition}
              onDeletePosition={handleDeletePosition}
              onPositionClick={handlePositionClick}
            />
          </Box>
        )}
      </Stack>

      <CreateFinancialGroupDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateGroup}
        isSubmitting={createGroupMutation.isPending}
      />

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

      <PositionFormDialog
        open={positionDialogOpen}
        mode={positionDialogMode}
        initialValues={
          editingPosition
            ? {
                name: editingPosition.name,
                amount: editingPosition.amount,
                positionType: editingPosition.positionType,
                frequencyType: editingPosition.frequencyType,
                date: editingPosition.date.slice(0, 10),
                notes: editingPosition.notes ?? "",
                category: editingPosition.category ?? "",
                interestRate: editingPosition.interestRate ?? undefined,
              }
            : undefined
        }
        onClose={() => setPositionDialogOpen(false)}
        onSubmit={handleSubmitPosition}
        onDelete={
          positionDialogMode === "edit"
            ? handleDeletePositionFromDialog
            : undefined
        }
        isSubmitting={
          createPositionMutation.isPending ||
          updatePositionMutation.isPending ||
          deletePositionMutation.isPending
        }
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;
          setSnackbarOpen(false);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
