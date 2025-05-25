import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Stack,
  Card,
  CardHeader,
  Divider,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

// Sample data
const students = [
  {
    id: 1,
    name: "Alice Johnson",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
  },
  { id: 2, name: "Bob Smith", avatarUrl: "https://i.pravatar.cc/150?img=12" },
  { id: 3, name: "Carol White", avatarUrl: "https://i.pravatar.cc/150?img=5" },
  { id: 4, name: "David Lee", avatarUrl: "https://i.pravatar.cc/150?img=65" },
  { id: 5, name: "Eva Green", avatarUrl: "https://i.pravatar.cc/150?img=15" },
];

const assignment = {
  id: 1,
  name: "Math Homework",
  submissions: {
    total: 5,
    turnedIn: 3,
    notTurnedIn: 2,
  },
  studentSubmissions: [
    {
      studentId: 1,
      studentName: "Alice Johnson",
      avatarUrl: "https://i.pravatar.cc/150?img=47",
      turnedIn: true,
      submissionData: "homework1.pdf",
    },
    {
      studentId: 2,
      studentName: "Bob Smith",
      avatarUrl: "https://i.pravatar.cc/150?img=12",
      turnedIn: false,
      submissionData: null,
    },
    {
      studentId: 3,
      studentName: "Carol White",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
      turnedIn: true,
      submissionData: "homework1.docx",
    },
    {
      studentId: 4,
      studentName: "David Lee",
      avatarUrl: "https://i.pravatar.cc/150?img=65",
      turnedIn: false,
      submissionData: null,
    },
    {
      studentId: 5,
      studentName: "Eva Green",
      avatarUrl: "https://i.pravatar.cc/150?img=15",
      turnedIn: true,
      submissionData: "homework1.pdf",
    },
  ],
};

export default function StudentWork() {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null,
  );
  const [menuStudentId, setMenuStudentId] = React.useState<number | null>(null);

  const openMenu = Boolean(menuAnchorEl);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    studentId: number,
  ) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuStudentId(studentId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuStudentId(null);
  };

  const handleGrade = () => {
    alert(`Grade student ID: ${menuStudentId}`);
    handleMenuClose();
  };

  const handleTurnedIn = () => {
    alert(`View turned in for student ID: ${menuStudentId}`);
    handleMenuClose();
  };

  const handleMarkComplete = () => {
    alert(`Mark as complete student ID: ${menuStudentId}`);
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        // minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        width: "100%",
        border: "1px solid #ddd",
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      {/* Left Panel */}
      <Box
        sx={{
          width: "40%",
          borderRight: "1px solid #ccc",
          overflowY: "auto",
          bgcolor: "background.paper",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 2, borderBottom: "1px solid #eee" }}
        >
          <Typography variant="h6">Students</Typography>
          <IconButton aria-label="Add student">
            <PersonAddIcon />
          </IconButton>
        </Stack>

        <List disablePadding>
          {students.map(({ id, name, avatarUrl }) => (
            <ListItem
              key={id}
              divider
              sx={{
                overflowY: "auto",
                bgcolor: "background.default",
                maxHeight: "100vh",
              }}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={(e) => handleMenuOpen(e, id)}
                  aria-label="student actions"
                >
                  <MoreVertIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar alt={name} src={avatarUrl} />
              </ListItemAvatar>
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </List>

        <Menu
          anchorEl={menuAnchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <MenuItem onClick={handleGrade}>Grade</MenuItem>
          <MenuItem onClick={handleTurnedIn}>Turned In</MenuItem>
          <MenuItem onClick={handleMarkComplete}>Mark as Complete</MenuItem>
        </Menu>
      </Box>

      {/* Right Panel */}
      <Box
        sx={{
          width: "60%",
          overflowY: "auto",
          bgcolor: "background.default",
          maxHeight: "100vh",
          p: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {assignment.name}
        </Typography>

        <Stack direction="row" spacing={4} mb={3}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Turned In
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {assignment.submissions.turnedIn}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Assigned
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {assignment.submissions.notTurnedIn}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Total
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {assignment.submissions.total}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6" gutterBottom>
          Submissions
        </Typography>

        <Stack spacing={2}>
          {assignment.studentSubmissions.map(
            ({
              studentId,
              studentName,
              avatarUrl,
              turnedIn,
              submissionData,
            }) => (
              <Card
                key={studentId}
                variant="outlined"
                sx={{
                  bgcolor: turnedIn ? "action.selected" : "background.paper",
                }}
              >
                <CardHeader
                  avatar={<Avatar alt={studentName} src={avatarUrl} />}
                  title={studentName}
                  subheader={
                    turnedIn ? (
                      <Typography color="success.main" variant="body2">
                        {submissionData || "Submitted"}
                      </Typography>
                    ) : (
                      <Typography color="text.secondary" variant="body2">
                        Not Submitted
                      </Typography>
                    )
                  }
                />
              </Card>
            ),
          )}
        </Stack>
      </Box>
    </Box>
  );
}
