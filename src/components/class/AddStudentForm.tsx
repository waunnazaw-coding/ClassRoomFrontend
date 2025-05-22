import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema for email validation
const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

interface AddStudentFormProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (email: string) => void;
}

const AddStudentForm: React.FC<AddStudentFormProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: FormData) => {
    if (onCreate) {
      onCreate(data.email.trim());
    } else {
      alert(`Adding student with email: ${data.email}`);
    }
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
      maxWidth="sm"
      fullWidth
      aria-labelledby="add-student-dialog-title"
    >
      <DialogTitle id="add-student-dialog-title" sx={{ fontWeight: 600 }}>
        Add New Student
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Enter the email address of the student you want to add to the class.
        </Typography>

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Student Email"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
              placeholder="student@example.com"
              type="email"
              autoFocus
            />
          )}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || isSubmitting}
        >
          Add Student
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStudentForm;
