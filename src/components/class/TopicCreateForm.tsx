import React, { useState } from "react";
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
  CircularProgress,
} from "@mui/material";

import { createTopic } from "@/services/topic";
import { CreateTopicDto, TopicDto } from "../../types";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TopicCreateFormProps {
  open: boolean;
  onClose: () => void;
  userId: number;
  onCreate?: (createdTopic: TopicDto) => void; // callback with created topic
}

const TopicCreateForm: React.FC<TopicCreateFormProps> = ({
  open,
  onClose,
  userId,
  onCreate,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [topicName, setTopicName] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!topicName.trim()) {
      setError("Please enter a topic name.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const createDto: CreateTopicDto = {
        title: topicName.trim(),
        userId,
      };

      const createdTopic = await createTopic(createDto);

      // Show success toast
      toast.success("Topic created successfully!");

      // Optionally pass created topic to parent
      if (onCreate) {
        onCreate(createdTopic);
      }

      // Reset form and close dialog
      setTopicName("");
      setTopicDescription("");
      onClose();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create topic. Please try again.";

      setError(errorMessage);

      // Show error toast
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return; // prevent closing while loading
    setTopicName("");
    setTopicDescription("");
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      aria-labelledby="create-topic-dialog-title"
    >
      <DialogTitle id="create-topic-dialog-title" sx={{ fontWeight: 600 }}>
        Create New Topic
      </DialogTitle>

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
          error={Boolean(error)}
          helperText={error || "Please enter a descriptive topic name"}
          disabled={loading}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!topicName.trim() || loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TopicCreateForm;
