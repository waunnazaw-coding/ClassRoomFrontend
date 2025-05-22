import React from "react";
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

interface CreateClassDialogProps {
  open: boolean;
  onClose: () => void;
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
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<CreateClassForm>({
    resolver: zodResolver(schema),
    mode: "onChange", // Real-time validation
  });

  const onSubmit = (data: CreateClassForm) => {
    console.log("Form Submitted:", data);
    reset();
    onClose();
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
          />
          <TextField
            fullWidth
            label="Section (optional)"
            variant="outlined"
            margin="normal"
            {...register("section")}
          />
          <TextField
            fullWidth
            label="Subject (optional)"
            variant="outlined"
            margin="normal"
            {...register("subject")}
          />
          <TextField
            fullWidth
            label="Room (optional)"
            variant="outlined"
            margin="normal"
            {...register("room")}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isDirty || !isValid}
          >
            Create
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateClassDialog;
