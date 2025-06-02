import * as React from "react";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Grid,
  TextField,
  Card,
  Stack,
  Checkbox,
  FormControlLabel,
  Box,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkIcon from "@mui/icons-material/Link";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const dummyParticipants = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Charlie Brown" },
  { id: 4, name: "David Lee" },
];

const dummyTopics = [
  { id: 1, name: "Algebra" },
  { id: 2, name: "Geometry" },
  { id: 3, name: "Trigonometry" },
];

type Attachment = {
  type: "YouTube" | "Link" | "File";
  value: string;
  fileObj?: File;
};

interface AssignmentDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function MaterialCreateForm({
  open,
  onClose,
}: AssignmentDialogProps) {
  // State
  const [title, setTitle] = React.useState("");
  const [instructions, setInstructions] = React.useState("");
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const [youtubeDialogOpen, setYoutubeDialogOpen] = React.useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = React.useState(false);
  const [youtubeInput, setYoutubeInput] = React.useState("");
  const [linkInput, setLinkInput] = React.useState("");
  const [fileInput, setFileInput] = React.useState<File | null>(null);
  const [participantsDialogOpen, setParticipantsDialogOpen] =
    React.useState(false);
  const [selectedParticipantIds, setSelectedParticipantIds] = React.useState<
    number[]
  >(dummyParticipants.map((p) => p.id)); // default all selected
  const [topicValue, setTopicValue] = React.useState<{
    id?: number;
    name: string;
  } | null>(null);
  const [topicInputValue, setTopicInputValue] = React.useState("");
  const [allowLateSubmission, setAllowLateSubmission] = React.useState(true);
  const [youtubeError, setYoutubeError] = React.useState(false);

  // Attachment handlers
  const handleAddYoutube = () => {
    if (
      !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(
        youtubeInput.trim(),
      )
    ) {
      setYoutubeError(true);
      return;
    }
    setAttachments((prev) => [
      ...prev,
      { type: "YouTube", value: youtubeInput.trim() },
    ]);
    setYoutubeInput("");
    setYoutubeDialogOpen(false);
    setYoutubeError(false);
  };

  const handleAddLink = () => {
    if (!linkInput.trim()) return;
    setAttachments((prev) => [
      ...prev,
      { type: "Link", value: linkInput.trim() },
    ]);
    setLinkInput("");
    setLinkDialogOpen(false);
  };

  const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAttachments((prev) => [
        ...prev,
        { type: "File", value: file.name, fileObj: file },
      ]);
      setFileInput(null);
      // Reset file input value to allow re-uploading the same file
      e.target.value = "";
    }
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  // Participants dialog handlers
  const handleToggleParticipant = (id: number) => {
    setSelectedParticipantIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  const handleSelectAllParticipants = () => {
    setSelectedParticipantIds(dummyParticipants.map((p) => p.id));
  };

  // Topic Autocomplete handlers
  const handleTopicChange = (
    event: any,
    newValue: { id?: number; name: string } | string | null,
  ) => {
    if (typeof newValue === "string") {
      setTopicValue({ name: newValue });
    } else if (newValue && typeof newValue === "object") {
      setTopicValue(newValue);
    } else {
      setTopicValue(null);
    }
  };

  // Save
  const handleSave = () => {
    const topic =
      topicValue && topicValue.id
        ? dummyTopics.find((t) => t.id === topicValue.id)?.name
        : topicInputValue || topicValue?.name || "";

    alert(`
      Title: ${title}
      Instructions: ${instructions}
      Attachments: ${attachments.map((a) => a.type + ": " + a.value).join(", ")}
      Topic: ${topic}
      Selected Participant IDs: ${selectedParticipantIds.join(", ")}
      Allow Late Submission: ${allowLateSubmission ? "Yes" : "No"}
    `);
    onClose();
  };

  return (
    <>
      <Dialog fullScreen open={open} onClose={onClose}>
        <AppBar sx={{ position: "relative", backgroundColor: "#1976d2" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onClose}>
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              Create Matrial
            </Typography>
            <Button color="inherit" onClick={handleSave}>
              Save
            </Button>
          </Toolbar>
        </AppBar>

        <Grid container spacing={3} sx={{ padding: 4 }}>
          {/* Left: Main form */}
          <Grid size={8}>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Assignment Title"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <TextField
                label="Instructions"
                variant="outlined"
                fullWidth
                multiline
                minRows={6}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
              />

              {attachments.length > 0 && (
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Attachments
                  </Typography>
                  <Stack spacing={1}>
                    {attachments.map((att, idx) => (
                      <Box
                        key={idx}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="body2"
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {att.type === "YouTube" && (
                            <YouTubeIcon color="error" fontSize="small" />
                          )}
                          {att.type === "Link" && (
                            <LinkIcon color="primary" fontSize="small" />
                          )}
                          {att.type === "File" && (
                            <AttachFileIcon fontSize="small" />
                          )}
                          {att.value}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveAttachment(idx)}
                        >
                          <RemoveCircleIcon color="error" />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                </Card>
              )}

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<YouTubeIcon color="error" />}
                  onClick={() => setYoutubeDialogOpen(true)}
                >
                  Add YouTube
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LinkIcon />}
                  onClick={() => setLinkDialogOpen(true)}
                >
                  Add Link
                </Button>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFileIcon />}
                >
                  Upload File
                  <input type="file" hidden onChange={handleAddFile} />
                </Button>
              </Stack>
            </Box>
          </Grid>

          {/* Right: Participants, Topic, Late Submission */}
          <Grid size={4}>
            <Card
              sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}
            >
              <Autocomplete
                freeSolo
                options={dummyTopics}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.name
                }
                value={topicValue}
                inputValue={topicInputValue}
                onChange={handleTopicChange}
                onInputChange={(event, newInputValue) =>
                  setTopicInputValue(newInputValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Topic"
                    placeholder="Select or create topic"
                  />
                )}
              />
            </Card>
          </Grid>
        </Grid>
      </Dialog>

      {/* YouTube Dialog */}
      <Dialog
        open={youtubeDialogOpen}
        onClose={() => setYoutubeDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="youtube-dialog-title"
      >
        <DialogTitle id="youtube-dialog-title">
          <Stack direction="row" alignItems="center" spacing={1}>
            <YouTubeIcon color="error" fontSize="large" />
            <Box
              component="span"
              sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
            >
              Add YouTube URL
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Typography
            variant="body2"
            color="textSecondary"
            gutterBottom
            sx={{ mb: 2 }}
          >
            Please enter a valid YouTube video URL. For example:{" "}
            <Box
              component="span"
              sx={{ fontStyle: "italic", color: "primary.main" }}
            >
              https://www.youtube.com/watch?v=dQw4w9WgXcQ
            </Box>
          </Typography>
          <TextField
            autoFocus
            label="YouTube URL"
            variant="outlined"
            fullWidth
            value={youtubeInput}
            onChange={(e) => setYoutubeInput(e.target.value)}
            error={youtubeError}
            helperText={
              youtubeError
                ? "Invalid YouTube URL. Please check and try again."
                : " "
            }
            placeholder="https://youtube.com/..."
            aria-describedby="youtube-url-helper-text"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setYoutubeDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddYoutube}
            variant="contained"
            disabled={!youtubeInput.trim()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Link Dialog */}
      <Dialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="add-link-dialog-title"
      >
        <DialogTitle id="add-link-dialog-title">
          <Stack direction="row" alignItems="center" spacing={1}>
            <LinkIcon color="primary" />
            <Box
              component="span"
              sx={{ fontWeight: "bold", fontSize: "1.25rem" }}
            >
              Add Link URL
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Please enter a valid web URL starting with <code>https://</code> or{" "}
            <code>http://</code>.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Example:{" "}
            <Box
              component="span"
              sx={{ fontStyle: "italic", color: "primary.main" }}
            >
              https://example.com/page
            </Box>
          </Typography>

          <TextField
            autoFocus
            label="Link URL"
            variant="outlined"
            fullWidth
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            placeholder="https://example.com/..."
            aria-describedby="link-url-helper-text"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddLink}
            variant="contained"
            disabled={!linkInput.trim()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
