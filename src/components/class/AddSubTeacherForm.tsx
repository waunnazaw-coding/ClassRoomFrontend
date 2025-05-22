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

// Zod schema for email only
const schema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

interface AddSubTeacherFormProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (email: string) => void;
}

const AddSubTeacherForm: React.FC<AddSubTeacherFormProps> = ({
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
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
    mode: "onChange", // <-- validate on change to update isValid immediately
  });

  const onSubmit = (data: FormData) => {
    if (onCreate) {
      onCreate(data.email);
    } else {
      alert(`Email submitted: ${data.email}`);
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
      aria-labelledby="add-sub-teacher-dialog-title"
    >
      <DialogTitle id="add-sub-teacher-dialog-title" sx={{ fontWeight: 600 }}>
        Add Sub Teacher Email
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Enter the email address of the sub teacher
        </Typography>

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              label="Email"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              multiline
              minRows={1.5}
              maxRows={3}
              size="small"
              placeholder="Enter email address"
              type="email"
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
          disabled={!isValid || isSubmitting} // <-- disable if form invalid or submitting
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSubTeacherForm;
