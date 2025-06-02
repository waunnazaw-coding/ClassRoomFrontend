import React, { useState } from "react";
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
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClass } from "../../services/classes"; // Adjust path as needed
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClassRequestDto, ClassResponseDto } from "../../types/index";

interface CreateClassDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateSuccess: (newClass: ClassResponseDto) => void;
  createdBy?: number; // Optional userId prop if needed
}

const schema = z.object({
  className: z.string().min(1, "Class Name is required"),
  section: z.string().optional(),
  subject: z.string().optional(),
  room: z.string().optional(),
});

type CreateClassForm = z.infer<typeof schema>;

const CreateClassDialog: React.FC<CreateClassDialogProps> = ({
  open,
  onClose,
  onCreateSuccess,
  createdBy,
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
    mode: "onChange", // Real-time validation
  });

  const onSubmit = async (data: CreateClassForm) => {
    setLoading(true);
    try {
      // Prepare the request payload, mapping form fields to API fields
      const payload: ClassRequestDto = {
        userId: createdBy || 0, // Use provided userId or default to 0
        name: data.className,
        section: data.section || "",
        subject: data.subject || "",
        room: data.room || "",
      };

      const newClass = await createClass(payload);

      console.log("New Class Created:", newClass);

      const classData = newClass;

      toast.success(
        `Class "${classData?.name || "Untitled"}" created successfully.`,
      );
      onCreateSuccess(classData); // Pass the freshly created class directly
      reset();
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create class. Please try again.",
      );
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
      <DialogTitle>Create a New Class</DialogTitle>
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
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateClassDialog;
