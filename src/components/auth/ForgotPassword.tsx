import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({
  open,
  handleClose,
}: ForgotPasswordProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // You can add form validation or API call here
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        sx: {
          backgroundImage: "none",
          p: 3,
        },
      }}
      aria-labelledby="forgot-password-dialog-title"
      aria-describedby="forgot-password-dialog-description"
    >
      <DialogTitle
        id="forgot-password-dialog-title"
        sx={{ pb: 1, fontWeight: 600 }}
      >
        Reset Your Password
      </DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
        <DialogContentText
          id="forgot-password-dialog-description"
          sx={{ mb: 2 }}
        >
          Please enter the email address associated with your account. We will
          send you a link to reset your password.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="normal"
          id="email"
          name="email"
          label="Email Address"
          placeholder="you@example.com"
          type="email"
          fullWidth
          variant="outlined"
          autoComplete="email"
        />
      </DialogContent>
      <DialogActions sx={{ pt: 1, pb: 2, px: 3 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button variant="contained" type="submit">
          Send Reset Link
        </Button>
      </DialogActions>
    </Dialog>
  );
}
