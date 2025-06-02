import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import {
  Box,
  Divider,
  Stack,
  Select,
  FormControl,
  InputLabel,
  MenuItem as MuiMenuItem,
  SelectChangeEvent,
} from "@mui/material";
import AssignmentDialog from "./AssignmentCreateForm";
import MaterialDialog from "./MaterialCreateForm";
import TopicDialog from "./TopicCreateForm";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import TopicIcon from "@mui/icons-material/Topic";
import InstructionCard from "../assignments/InstructionCard";

interface ClassWorkProps {
  role: string;
  classId: number;
  userId: number;
}

export default function ClassWork({ role, userId, classId }: ClassWorkProps) {
  const [assignmentOpen, setAssignmentOpen] = React.useState(false);
  const [materialOpen, setMaterialOpen] = React.useState(false);
  const [topicOpen, setTopicOpen] = React.useState(false);

  const assignmentName = "Chapter 3: Quadratic Equations";
  const assignmentInstructions = `Please complete all exercises on pages 45-50.\nSubmit your answers as a single PDF file.\nMake sure to show all your work.`;

  const handleEdit = () => {
    alert("Edit assignment clicked");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      alert("Assignment deleted");
    }
  };

  const normalizedRole = role.toLowerCase();
  const isTeacher = normalizedRole === "teacher";
  const isSubTeacher = normalizedRole === "subteacher";
  const isStudent = normalizedRole === "student";

  // Example topics for student select box - replace with real data
  const topics = [
    { id: 1, name: "Algebra" },
    { id: 2, name: "Geometry" },
    { id: 3, name: "Trigonometry" },
  ];

  const [selectedTopic, setSelectedTopic] = React.useState<number | "">("");

  const handleTopicChange = (event: SelectChangeEvent<number | "">) => {
    setSelectedTopic(event.target.value as number);
    alert(`Selected topic ID: ${event.target.value}`);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 6, width: "100%", position: "relative" }}>
      {(isTeacher || isSubTeacher) && (
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <>
              <Button variant="contained" {...bindTrigger(popupState)}>
                Create New
              </Button>
              <Menu {...bindMenu(popupState)}>
                <MenuItem
                  onClick={() => {
                    popupState.close();
                    setAssignmentOpen(true);
                  }}
                >
                  <AssignmentIcon sx={{ mr: 1 }} />
                  Assignment
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    popupState.close();
                    setMaterialOpen(true);
                  }}
                >
                  <DescriptionIcon sx={{ mr: 1 }} />
                  Material
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    popupState.close();
                    setTopicOpen(true);
                  }}
                >
                  <TopicIcon sx={{ mr: 1 }} />
                  Topic
                </MenuItem>
              </Menu>
            </>
          )}
        </PopupState>
      )}

      {isStudent && (
        <Box sx={{ mb: 3, maxWidth: 300 }}>
          <FormControl fullWidth>
            <InputLabel id="topic-select-label">Select Topic</InputLabel>
            <Select
              labelId="topic-select-label"
              id="topic-select"
              value={selectedTopic}
              label="Select Topic"
              onChange={handleTopicChange}
            >
              <MuiMenuItem value="">
                <em>None</em>
              </MuiMenuItem>
              {topics.map((topic) => (
                <MuiMenuItem key={topic.id} value={topic.id}>
                  {topic.name}
                </MuiMenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <Box sx={{ width: "100%", pt: 4 }}>
        <Stack spacing={2}>
          <InstructionCard
            name={assignmentName}
            instructions={assignmentInstructions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <InstructionCard
            name={assignmentName}
            instructions={assignmentInstructions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <InstructionCard
            name={assignmentName}
            instructions={assignmentInstructions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <InstructionCard
            name={assignmentName}
            instructions={assignmentInstructions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Stack>
      </Box>

      {/* Dialogs */}
      <AssignmentDialog
        open={assignmentOpen}
        onClose={() => setAssignmentOpen(false)}
        classId={classId}
      />
      <MaterialDialog
        open={materialOpen}
        onClose={() => setMaterialOpen(false)}
      />
      <TopicDialog
        open={topicOpen}
        onClose={() => setTopicOpen(false)}
        userId={userId}
      />
    </Box>
  );
}
