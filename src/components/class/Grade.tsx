import React from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Collapse,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// Sample data
const assignments = [
  {
    id: 1,
    name: "Math Homework",
    students: [
      { id: 1, name: "Alice Johnson", grade: 85 },
      { id: 2, name: "Bob Smith", grade: 90 },
      { id: 3, name: "Carol White", grade: 78 },
      { id: 4, name: "David Lee", grade: 88 },
      { id: 5, name: "Eva Green", grade: 92 },
      { id: 6, name: "Frank Harris", grade: 81 },
      { id: 7, name: "Grace Kim", grade: 87 },
      { id: 8, name: "Hannah Scott", grade: 93 },
      { id: 9, name: "Ian Moore", grade: 79 },
      { id: 10, name: "Jane Doe", grade: 85 },
    ],
  },
  {
    id: 2,
    name: "Science Project",
    students: [
      { id: 1, name: "Alice Johnson", grade: 80 },
      { id: 2, name: "Bob Smith", grade: 85 },
      { id: 3, name: "Carol White", grade: 82 },
      { id: 4, name: "David Lee", grade: 90 },
      { id: 5, name: "Eva Green", grade: 87 },
    ],
  },
];

export default function AssignmentCardsWithToggle() {
  // State for menu anchor and selected student
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null,
  );
  const [selectedStudentId, setSelectedStudentId] = React.useState<
    number | null
  >(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = React.useState<
    number | null
  >(null);

  // State to track which assignment cards are expanded
  const [expandedAssignments, setExpandedAssignments] = React.useState<
    Set<number>
  >(new Set());

  const openMenu = Boolean(menuAnchorEl);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    assignmentId: number,
    studentId: number,
  ) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedAssignmentId(assignmentId);
    setSelectedStudentId(studentId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedAssignmentId(null);
    setSelectedStudentId(null);
  };

  const handleGrade = () => {
    alert(
      `Grade student ID ${selectedStudentId} for assignment ID ${selectedAssignmentId}`,
    );
    handleMenuClose();
  };

  const handleExport = () => {
    alert(
      `Export data for student ID ${selectedStudentId} for assignment ID ${selectedAssignmentId}`,
    );
    handleMenuClose();
  };

  const toggleExpand = (assignmentId: number) => {
    setExpandedAssignments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(assignmentId)) {
        newSet.delete(assignmentId);
      } else {
        newSet.add(assignmentId);
      }
      return newSet;
    });
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 6,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {assignments.map(({ id: assignmentId, name, students }) => {
        const isExpanded = expandedAssignments.has(assignmentId);
        return (
          <Card
            key={assignmentId}
            variant="outlined"
            sx={{ maxWidth: "1200px" }}
          >
            <CardHeader
              title={name}
              titleTypographyProps={{
                fontWeight: "bold",
                fontSize: "1.25rem",
              }}
              action={
                <IconButton
                  aria-label={
                    isExpanded ? "Collapse student list" : "Expand student list"
                  }
                  onClick={() => toggleExpand(assignmentId)}
                  size="large"
                >
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              }
            />
            <Divider />
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <CardContent sx={{ maxHeight: 360, overflowY: "auto", p: 0 }}>
                <List disablePadding>
                  {students.map(
                    ({ id: studentId, name: studentName, grade }) => (
                      <ListItem
                        key={studentId}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="student actions"
                            onClick={(e) =>
                              handleMenuOpen(e, assignmentId, studentId)
                            }
                          >
                            <MoreVertIcon />
                          </IconButton>
                        }
                        divider
                        sx={{ px: 2, py: 1.5 }}
                      >
                        <ListItemAvatar>
                          <Avatar>{studentName.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body1" fontWeight="medium">
                              {studentName}
                            </Typography>
                          }
                          secondary={`Grade: ${grade}%`}
                        />
                      </ListItem>
                    ),
                  )}
                </List>
              </CardContent>
            </Collapse>
          </Card>
        );
      })}

      {/* Menu for student actions */}
      <Menu
        anchorEl={menuAnchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleGrade}>Grade</MenuItem>
        <MenuItem onClick={handleExport}>Export</MenuItem>
      </Menu>
    </Box>
    // </Box>
  );
}
