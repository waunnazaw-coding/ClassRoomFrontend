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
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkIcon from "@mui/icons-material/Link";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { getClassParticipants } from "@/services/classes";
import { getAllTopics } from "@/services/topic";
import { TopicDto, UserDto } from "@/types";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // Make sure you have installed @mui/x-date-pickers
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { createAssignment } from "@/services/assignment";
import { createTopic } from "@/services/topic";
import type { CreateTopicDto } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

type Attachment = {
  type: "YouTube" | "Link" | "Upload";
  value: string;
  fileObj?: File;
};

interface AssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  classId: number;
}

export default function AssignmentCreateForm({
  open,
  onClose,
  classId,
}: AssignmentDialogProps) {
  const { user } = useAuth();
  const [title, setTitle] = React.useState("");
  const [instructions, setInstructions] = React.useState("");
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const [youtubeDialogOpen, setYoutubeDialogOpen] = React.useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = React.useState(false);
  const [youtubeInput, setYoutubeInput] = React.useState("");
  const [linkInput, setLinkInput] = React.useState("");
  const [fileInput, setFileInput] = React.useState<File | null>(null);
  const [dummyTopics, setTopics] = React.useState<TopicDto[]>([]);
  const [dummyParticipants, setStudents] = React.useState<UserDto[]>([]);
  const [selectedParticipantIds, setSelectedParticipantIds] = React.useState<
    number[]
  >([]);
  const [topicValue, setTopicValue] = React.useState<TopicDto | null>(null);
  const [topicInputValue, setTopicInputValue] = React.useState("");
  const [points, setPoints] = React.useState<number | "">("");

  const [participantsDialogOpen, setParticipantsDialogOpen] =
    React.useState(false);

  const [allowLateSubmission, setAllowLateSubmission] = React.useState(true);
  const [youtubeError, setYoutubeError] = React.useState(false);
  const [dueDate, setDueDate] = React.useState<Date | null>(null);

  React.useEffect(() => {
    if (!classId) return;

    getAllTopics(classId).then(setTopics);

    // console.log(dummyTopics);

    getClassParticipants(classId).then((users) => {
      // Optionally filter by role, e.g., only students
      const students = users.filter((u) => u.role.toLowerCase() === "student");
      setStudents(students);
      setSelectedParticipantIds(students.map((s) => s.id));
    });
  }, [classId]);

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
        { type: "Upload", value: file.name, fileObj: file },
      ]);
      setFileInput(null);
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
    event: React.SyntheticEvent,
    newValue: TopicDto | string | null,
  ) => {
    if (typeof newValue === "string") {
      setTopicValue({ id: 0, title: newValue }); // new topic with id=0
    } else if (newValue && typeof newValue === "object") {
      setTopicValue(newValue);
    } else {
      setTopicValue(null);
    }
  };

  // Handler for points input change
  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setPoints(0);
    } else {
      const num = Number(val);
      if (!isNaN(num) && num >= 0 && num <= 100) {
        setPoints(num);
      }
    }
  };
  async function handleSave() {
    try {
      let topicId: number | undefined;

      const isNewTopic = !topicValue || !topicValue.id || topicValue.id === 0;

      if (isNewTopic) {
        if (!topicInputValue?.trim()) {
          toast.error("Please enter a topic title.");
          return;
        }

        const createDto: CreateTopicDto = {
          title: topicInputValue.trim(),
          userId: classId,
        };
      } else {
        topicId = topicValue.id;
      }

      const assignmentPayload = {
        classId,
        selectedTopicId: topicId,
        createNewTopic: isNewTopic,
        newTopicTitle: isNewTopic ? topicInputValue.trim() : undefined,
        assignmentTitle: title,
        instructions,
        points: points === "" ? undefined : points,
        dueDate: dueDate ?? undefined,
        allowLateSubmission,
        studentIds:
          selectedParticipantIds.length === dummyParticipants.length
            ? undefined
            : selectedParticipantIds,
        attachments,
      };

      await createAssignment(assignmentPayload);

      toast.success("Assignment created successfully!");
      onClose();
    } catch (error: any) {
      console.error("Failed to create assignment:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to create assignment. Please try again.",
      );
    }
  }

  return (
    <>
      <Dialog fullScreen open={open} onClose={onClose}>
        <AppBar sx={{ position: "relative", backgroundColor: "body.primary" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onClose}>
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              Create Assignment
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
                          {att.type === "Upload" && (
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

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid size={4}>
              <Card
                sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}
              >
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setParticipantsDialogOpen(true)}
                >
                  Select Participants
                </Button>

                <Autocomplete
                  freeSolo
                  options={dummyTopics}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.title
                  }
                  value={topicValue}
                  inputValue={topicInputValue}
                  onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                      // User typed a new topic (freeSolo)
                      setTopicValue({ id: 0, title: newValue });
                    } else if (newValue && typeof newValue === "object") {
                      setTopicValue(newValue);
                    } else {
                      setTopicValue(null);
                    }
                  }}
                  onInputChange={(event, newInputValue) =>
                    setTopicInputValue(newInputValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Topic"
                      placeholder="Select or create topic"
                      fullWidth
                    />
                  )}
                />

                <TextField
                  label="Points"
                  type="number"
                  inputProps={{ min: 0, max: 100 }}
                  value={points}
                  onChange={handlePointsChange}
                  helperText="Maximum points: 100"
                  fullWidth
                />

                <DatePicker
                  label="Due Date"
                  value={dueDate}
                  onChange={(newValue) => setDueDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                  disablePast
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={allowLateSubmission}
                      onChange={(e) => setAllowLateSubmission(e.target.checked)}
                    />
                  }
                  label="Allow Late Submission"
                />
              </Card>
            </Grid>
          </LocalizationProvider>
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

      {/* Participants Dialog */}
      <Dialog
        open={participantsDialogOpen}
        onClose={() => setParticipantsDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Select Participants</DialogTitle>
        <DialogContent dividers>
          {dummyParticipants.length === 0 ? (
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ py: 4 }}
            >
              No participants found for this class.
            </Typography>
          ) : (
            <List dense>
              {/* Select All */}
              <ListItem disablePadding>
                <ListItemButton
                  role="checkbox"
                  aria-checked={
                    selectedParticipantIds.length === dummyParticipants.length
                  }
                  selected={
                    selectedParticipantIds.length === dummyParticipants.length
                  }
                  onClick={handleSelectAllParticipants}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    bgcolor:
                      selectedParticipantIds.length === dummyParticipants.length
                        ? "action.selected"
                        : "inherit",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={
                        selectedParticipantIds.length ===
                        dummyParticipants.length
                      }
                      indeterminate={
                        selectedParticipantIds.length > 0 &&
                        selectedParticipantIds.length < dummyParticipants.length
                      }
                      tabIndex={-1}
                      disableRipple
                      color="primary"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="All Students"
                    primaryTypographyProps={{ fontWeight: "medium" }}
                  />
                </ListItemButton>
              </ListItem>

              {/* Individual Participants */}
              {dummyParticipants.map((p) => {
                const isSelected = selectedParticipantIds.includes(p.id);
                return (
                  <ListItem key={p.id} disablePadding>
                    <ListItemButton
                      role="checkbox"
                      aria-checked={isSelected}
                      selected={isSelected}
                      onClick={() => handleToggleParticipant(p.id)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        bgcolor: isSelected ? "action.selected" : "inherit",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={isSelected}
                          tabIndex={-1}
                          disableRipple
                          color="primary"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={p.name}
                        primaryTypographyProps={{
                          fontWeight: isSelected ? "medium" : "regular",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setParticipantsDialogOpen(false)}>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
