import React from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Stack,
  Divider,
  Paper,
  Button,
  Menu,
  MenuItem,
  Fade,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddStudentForm from "./AddStudentForm";
import AddSubTeacherForm from "./AddSubTeacherForm";
import ConfirmDialog from "../common/ConfirmDialog";
import textColor from "../common/CreateTheme";

const teachers = [
  {
    id: 1,
    name: "Alice Johnson",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
  },
  { id: 2, name: "Bob Smith", avatarUrl: "https://i.pravatar.cc/150?img=12" },
  { id: 3, name: "Carol White", avatarUrl: "https://i.pravatar.cc/150?img=5" },
];

const students = [
  { id: 1, name: "David Lee", avatarUrl: "https://i.pravatar.cc/150?img=65" },
  { id: 2, name: "Eva Green", avatarUrl: "https://i.pravatar.cc/150?img=15" },
  {
    id: 3,
    name: "Frank Harris",
    avatarUrl: "https://i.pravatar.cc/150?img=25",
  },
  { id: 4, name: "Grace Kim", avatarUrl: "https://i.pravatar.cc/150?img=32" },
  { id: 5, name: "David Lee", avatarUrl: "https://i.pravatar.cc/150?img=65" },
  { id: 6, name: "Eva Green", avatarUrl: "https://i.pravatar.cc/150?img=15" },
  {
    id: 7,
    name: "Frank Harris",
    avatarUrl: "https://i.pravatar.cc/150?img=25",
  },
  { id: 8, name: "Grace Kim", avatarUrl: "https://i.pravatar.cc/150?img=32" },
  { id: 9, name: "David Lee", avatarUrl: "https://i.pravatar.cc/150?img=65" },
  { id: 10, name: "Eva Green", avatarUrl: "https://i.pravatar.cc/150?img=15" },
  {
    id: 11,
    name: "Frank Harris",
    avatarUrl: "https://i.pravatar.cc/150?img=25",
  },
  { id: 12, name: "Grace Kim", avatarUrl: "https://i.pravatar.cc/150?img=32" },
  { id: 13, name: "David Lee", avatarUrl: "https://i.pravatar.cc/150?img=65" },
  { id: 14, name: "Eva Green", avatarUrl: "https://i.pravatar.cc/150?img=15" },
  {
    id: 15,
    name: "Frank Harris",
    avatarUrl: "https://i.pravatar.cc/150?img=25",
  },
  { id: 16, name: "Grace Kim", avatarUrl: "https://i.pravatar.cc/150?img=32" },
];

function People() {
  const [studentOpen, setStudent] = React.useState(false);
  const [subTeacherOpen, setSubTeacher] = React.useState(false);

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmUserName, setConfirmUserName] = React.useState("");
  const [confirmAction, setConfirmAction] = React.useState<
    "remove" | "transfer" | "email"
  >("remove");

  const [menuState, setMenuState] = React.useState<{
    anchorEl: HTMLElement | null;
    userId: number | null;
    userType: "teacher" | "student" | null;
  }>({
    anchorEl: null,
    userId: null,
    userType: null,
  });

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    userId: number,
    userType: "teacher" | "student",
  ) => {
    setMenuState({
      anchorEl: event.currentTarget,
      userId,
      userType,
    });
  };

  const handleMenuClose = () => {
    setMenuState({
      anchorEl: null,
      userId: null,
      userType: null,
    });
  };

  // Open confirm dialog with user name and action
  const openConfirmDialog = (
    userName: string,
    action: "remove" | "transfer" | "email",
  ) => {
    setConfirmUserName(userName);
    setConfirmAction(action);
    setConfirmOpen(true);
  };

  // Handle confirm dialog action
  const handleConfirm = () => {
    // Here you can add your logic for remove, transfer, email, etc.
    alert(`Confirmed ${confirmAction} action for ${confirmUserName}`);

    setConfirmOpen(false);
  };

  // Helper to get user name from id and type
  const getUserName = () => {
    const { userId, userType } = menuState;
    if (!userId || !userType) return "";
    const list = userType === "teacher" ? teachers : students;
    const user = list.find((u) => u.id === userId);
    return user ? user.name : "";
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 6,
        width: "100%",
      }}
    >
      {/* Teachers Section */}
      <Container sx={{ mb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" gutterBottom>
            Teachers
          </Typography>
          <Button
            sx={{ color: textColor }}
            aria-label="Add teacher"
            onClick={() => {
              setSubTeacher(true);
            }}
          >
            <PersonAddIcon />
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />
        <Paper elevation={0} sx={{ p: 1 }}>
          <Stack spacing={1} divider={<Divider flexItem />}>
            {teachers.map(({ id, name, avatarUrl }) => (
              <Stack
                key={id}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ py: 1, borderRadius: 1 }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    alt={name}
                    src={avatarUrl}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Typography variant="body1">{name}</Typography>
                </Stack>
                <Button
                  sx={{ color: textColor }}
                  aria-controls={
                    menuState.userType === "teacher" && menuState.userId === id
                      ? `teacher-menu-${id}`
                      : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={
                    menuState.userType === "teacher" && menuState.userId === id
                      ? "true"
                      : undefined
                  }
                  onClick={(e) => handleMenuOpen(e, id, "teacher")}
                >
                  <MoreVertIcon />
                </Button>

                <Menu
                  id={`teacher-menu-${id}`}
                  anchorEl={menuState.anchorEl}
                  open={
                    menuState.userType === "teacher" && menuState.userId === id
                  }
                  onClose={handleMenuClose}
                  TransitionComponent={Fade}
                  MenuListProps={{
                    "aria-labelledby": `teacher-menu-button-${id}`,
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      openConfirmDialog(name, "transfer");
                    }}
                  >
                    Transfer Ownership
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      openConfirmDialog(name, "remove");
                    }}
                  >
                    Remove
                  </MenuItem>
                </Menu>
              </Stack>
            ))}
          </Stack>
        </Paper>
      </Container>

      {/* Students Section */}
      <Container>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" gutterBottom>
            Students
          </Typography>
          <Button
            sx={{ color: textColor }}
            aria-label="Add student"
            onClick={() => {
              setStudent(true);
            }}
          >
            <PersonAddIcon />
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />
        <Paper elevation={0} sx={{ p: 1, bgcolor: "background.paper" }}>
          <Stack spacing={1} divider={<Divider flexItem />}>
            {students.map(({ id, name, avatarUrl }) => (
              <Stack
                key={id}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ py: 1, borderRadius: 1 }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    alt={name}
                    src={avatarUrl}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Typography variant="body1">{name}</Typography>
                </Stack>

                <Button
                  sx={{ color: textColor }}
                  aria-controls={
                    menuState.userType === "student" && menuState.userId === id
                      ? `student-menu-${id}`
                      : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={
                    menuState.userType === "student" && menuState.userId === id
                      ? "true"
                      : undefined
                  }
                  onClick={(e) => handleMenuOpen(e, id, "student")}
                >
                  <MoreVertIcon />
                </Button>

                <Menu
                  id={`student-menu-${id}`}
                  anchorEl={menuState.anchorEl}
                  open={
                    menuState.userType === "student" && menuState.userId === id
                  }
                  onClose={handleMenuClose}
                  TransitionComponent={Fade}
                  MenuListProps={{
                    "aria-labelledby": `student-menu-button-${id}`,
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      openConfirmDialog(name, "email");
                    }}
                  >
                    Email
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      openConfirmDialog(name, "remove");
                    }}
                  >
                    Remove
                  </MenuItem>
                </Menu>
              </Stack>
            ))}
          </Stack>
        </Paper>
      </Container>

      {/* Dialogs */}
      <AddStudentForm open={studentOpen} onClose={() => setStudent(false)} />
      <AddSubTeacherForm
        open={subTeacherOpen}
        onClose={() => setSubTeacher(false)}
      />
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        userName={confirmUserName}
        action={confirmAction}
      />
    </Box>
  );
}

export default People;
