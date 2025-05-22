import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface JoinClassDialogProps {
  open: boolean;
  onClose: () => void;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

const JoinClassDialog: React.FC<JoinClassDialogProps> = ({
  open,
  onClose,
  user,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [classCode, setClassCode] = React.useState("");

  const handleSubmit = () => {
    if (!classCode.trim()) {
      alert("Please enter a class code.");
      return;
    }
    // Submit logic here
    alert(`Joining class with code: ${classCode}`);
    setClassCode("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Join class</DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" mb={2}>
          {user?.avatarUrl ? (
            <Avatar src={user.avatarUrl} sx={{ mr: 2 }} />
          ) : (
            <Avatar sx={{ mr: 2 }}>
              <AccountCircleIcon />
            </Avatar>
          )}
          <Box>
            <Typography variant="body1">{user?.name || "User Name"}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email || "user@example.com"}
            </Typography>
          </Box>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          You're joining a class with a class code
        </Typography>

        <TextField
          fullWidth
          label="Class Code"
          variant="outlined"
          margin="normal"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
          helperText="Ask your teacher for the class code"
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!classCode.trim()}
        >
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinClassDialog;
