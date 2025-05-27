import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";

interface AssignmentDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AssignmentCreateFrom({
  open,
  onClose,
}: AssignmentDialogProps) {
  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <AppBar sx={{ position: "relative", backgroundColor: "#1976d2" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Assignment
          </Typography>
          <Button autoFocus color="inherit" onClick={onClose}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <List>
        <ListItemButton>
          <ListItemText
            primary="Assignment Title"
            secondary="Assignment Details"
          />
        </ListItemButton>
      </List>
    </Dialog>
  );
}
