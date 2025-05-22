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

  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <Box sx={{ flexGrow: 1, p: 2, width: "100%", maxWidth: 1200 }}>
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

          <Box sx={{ width: "100%" }}>
            <Stack spacing={2}>
              <Item>Item 1</Item>
              <Item>Item 2</Item>
              <Item>Item 3</Item>
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
