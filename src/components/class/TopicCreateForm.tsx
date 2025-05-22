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

interface TopicCreateFormProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (topicName: string, topicDescription: string) => void; // optional callback
}

const TopicCreateForm: React.FC<TopicCreateFormProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [topicName, setTopicName] = React.useState("");
  const [topicDescription, setTopicDescription] = React.useState("");

  const handleSubmit = () => {
    if (!topicName.trim()) {
      alert("Please enter a topic name.");
      return;
    }
    // Call optional onCreate callback with topic data
    if (onCreate) {
      onCreate(topicName.trim(), topicDescription.trim());
    } else {
      alert(`Creating topic: ${topicName.trim()}`);
    }
    // Reset fields and close dialog
    setTopicName("");
    setTopicDescription("");
    onClose();
  };

  const handleClose = () => {
    // Reset fields on close
    setTopicName("");
    setTopicDescription("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Create New Topic</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Enter details for the new topic
        </Typography>

        <TextField
          fullWidth
          label="Topic Name"
          variant="outlined"
          margin="normal"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          required
          autoFocus
          helperText="Please enter a descriptive topic name"
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!topicName.trim()}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TopicCreateForm;
