import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface CreateClassDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedData: {
    name: string;
    section?: string;
    subject?: string;
    room?: string;
  }) => Promise<void>;
  initialData: {
    name: string;
    section?: string;
    subject?: string;
    room?: string;
  };
}

const schema = z.object({
  className: z.string().min(1, "Class Name is required"),
  section: z.string().optional(),
  subject: z.string().optional(),
  room: z.string().optional(),
});

type CreateClassForm = z.infer<typeof schema>;

const EditClassDialog: React.FC<CreateClassDialogProps> = ({
  open,
  onClose,
  onUpdate,
  initialData,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<CreateClassForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      className: initialData.name,
      section: initialData.section || "",
      subject: initialData.subject || "",
      room: initialData.room || "",
    },
  });

  // Reset form when initialData or open changes
  useEffect(() => {
    reset({
      className: initialData.name,
      section: initialData.section || "",
      subject: initialData.subject || "",
      room: initialData.room || "",
    });
  }, [initialData, reset, open]);

  const onSubmit = async (data: CreateClassForm) => {
    setLoading(true);
    try {
      await onUpdate({
        name: data.className,
        section: data.section,
        subject: data.subject,
        room: data.room,
      });
      reset();
      onClose();
    } catch (error) {
      // Optionally handle error here or in onUpdate
      console.error("Failed to update class", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Edit Class</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <TextField
            fullWidth
            required
            label="Class Name"
            variant="outlined"
            margin="normal"
            {...register("className")}
            error={!!errors.className}
            helperText={errors.className?.message}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Section (optional)"
            variant="outlined"
            margin="normal"
            {...register("section")}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Subject (optional)"
            variant="outlined"
            margin="normal"
            {...register("subject")}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Room (optional)"
            variant="outlined"
            margin="normal"
            {...register("room")}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isDirty || !isValid || loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EditClassDialog;
