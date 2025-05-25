import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Box, Divider } from "@mui/material";
import AssignmentDialog from "./AssignmentCreateForm";
import MaterialDialog from "./MaterialCreateForm";
import TopicDialog from "./TopicCreateForm";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import TopicIcon from "@mui/icons-material/Topic";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import InstructionCard from "../assignments/InstructionCard";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function ClassWork() {
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
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <Box sx={{ flexGrow: 1, p: 6, width: "100%" }}>
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
          />
          <MaterialDialog
            open={materialOpen}
            onClose={() => setMaterialOpen(false)}
          />
          <TopicDialog open={topicOpen} onClose={() => setTopicOpen(false)} />
        </Box>
      )}
    </PopupState>
  );
}
