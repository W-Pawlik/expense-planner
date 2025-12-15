/* eslint-disable react-hooks/set-state-in-effect */
import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
  Box,
  Tooltip,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import UpdateIcon from "@mui/icons-material/Update";
import { useEffect, useState } from "react";
import { EditFinancialGroupSchema } from "../models/editFinancialGroup.schema";
import type { FinancialGroupSummary } from "../types/financialGroup.types";

interface FinancialGroupSummaryCardProps {
  group: FinancialGroupSummary;
  onUpdate: (changes: { name: string; description?: string | null }) => void;
  onDelete: () => void;
  onVisibilityClick: () => void;
  isBusy?: boolean;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString();
};

export const FinancialGroupSummaryCard = ({
  group,
  onUpdate,
  onDelete,
  onVisibilityClick,
  isBusy,
}: FinancialGroupSummaryCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description ?? "");

  const [nameError, setNameError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  useEffect(() => {
    setName(group.name);
    setDescription(group.description ?? "");
    setNameError(null);
    setDescriptionError(null);
  }, [group.id, group.name, group.description]);

  const visibilityLabel =
    group.visibilityStatus === "PUBLIC" ? "Public" : "Private";

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setName(group.name);
    setDescription(group.description ?? "");
    setNameError(null);
    setDescriptionError(null);
  };

  const handleSaveEdit = () => {
    const result = EditFinancialGroupSchema.safeParse({
      name: name.trim(),
      description: description.trim(),
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setNameError(fieldErrors.name?.[0] ?? null);
      setDescriptionError(fieldErrors.description?.[0] ?? null);
      return;
    }

    setNameError(null);
    setDescriptionError(null);

    const values = result.data;

    onUpdate({
      name: values.name,
      description: values.description?.trim() || null,
    });

    setIsEditing(false);
  };

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 1,
        p: 1,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box sx={{ flex: 1 }}>
            {isEditing ? (
              <Stack spacing={1}>
                <TextField
                  label="Group name"
                  size="small"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError(null);
                  }}
                  error={!!nameError}
                  helperText={nameError ?? ""}
                />
                <TextField
                  label="Description"
                  size="small"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (descriptionError) setDescriptionError(null);
                  }}
                  multiline
                  minRows={2}
                  error={!!descriptionError}
                  helperText={descriptionError ?? ""}
                />
              </Stack>
            ) : (
              <>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {group.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {group.description || "No description provided."}
                </Typography>
              </>
            )}
          </Box>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <Stack spacing={0.5} alignItems="flex-start">
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase" }}
              >
                Visibility
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={onVisibilityClick}
                startIcon={
                  group.visibilityStatus === "PUBLIC" ? (
                    <VisibilityIcon fontSize="small" />
                  ) : (
                    <VisibilityOffIcon fontSize="small" />
                  )
                }
                sx={{ textTransform: "none" }}
              >
                {visibilityLabel}
              </Button>
            </Stack>

            <Stack spacing={0.5}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase" }}
              >
                Created
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CalendarTodayIcon fontSize="small" />
                <Typography variant="body2">
                  {formatDate(group.createdAt)}
                </Typography>
              </Stack>
            </Stack>

            <Stack spacing={0.5}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase" }}
              >
                Last Updated
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <UpdateIcon fontSize="small" />
                <Typography variant="body2">
                  {formatDate(group.updatedAt)}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1}>
              {isEditing ? (
                <>
                  <Tooltip title="Save changes">
                    <span>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={handleSaveEdit}
                        disabled={isBusy}
                      >
                        <SaveIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Cancel">
                    <IconButton
                      size="small"
                      onClick={handleCancelEdit}
                      disabled={isBusy}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip title="Edit group">
                    <IconButton
                      size="small"
                      onClick={handleStartEdit}
                      disabled={isBusy}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete group">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={onDelete}
                      disabled={isBusy}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
