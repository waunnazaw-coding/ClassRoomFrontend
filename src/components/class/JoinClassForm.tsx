import React, { useState } from "react";
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
import { enrollInClass } from "../../services/classes";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../contexts/AuthContext";

interface JoinClassDialogProps {
  open: boolean;
  onClose: () => void;
  onJoinSuccess: () => void;
}

const JoinClassDialog: React.FC<JoinClassDialogProps> = ({
  open,
  onClose,
  onJoinSuccess,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!classCode.trim()) {
      toast.error("Please enter a class code.");
      return;
    }
    if (!user) {
      toast.error("User not logged in.");
      return;
    }

    setLoading(true);
    try {
      const res = await enrollInClass(classCode.trim(), user.id);
      console.log("Enrollment response:", res);
      toast.success(res.message || "Successfully joined the class.");
      setClassCode("");
      onJoinSuccess(); // Notify parent to refresh classes
      onClose();
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to join class. Please check the code and try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
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
          {user?.profile ? (
            <Avatar src={user.profile} sx={{ mr: 2 }} />
          ) : (
            <Avatar sx={{ mr: 2 }}>
              <AccountCircleIcon />
            </Avatar>
          )}
          <Box>
            <Typography variant="body1">
              {user?.username || "User Name"}
            </Typography>
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
          disabled={loading}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!classCode.trim() || loading}
        >
          {loading ? "Joining..." : "Join"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinClassDialog;
