import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper, { PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";
import { Typography } from "@mui/material";

function PaperComponent(props: PaperProps) {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLDivElement>}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
  action?: "remove" | "transfer" | "email"; // you can extend as needed
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  userName = "",
  action = "remove",
}: ConfirmDialogProps) {
  // Define dialog content and colors based on action
  const actionTexts: Record<
    string,
    {
      title: string;
      description: string;
      confirmColor: "error" | "primary" | "info";
    }
  > = {
    remove: {
      title: "Confirm Removal",
      description: `Are you sure you want to remove ${userName}? This action cannot be undone.`,
      confirmColor: "error",
    },
    transfer: {
      title: "Confirm Ownership Transfer",
      description: `Are you sure you want to transfer ownership to ${userName}?`,
      confirmColor: "primary",
    },
    email: {
      title: "Send Email",
      description: `Send an email to ${userName}?`,
      confirmColor: "info",
    },
  };

  const { title, description, confirmColor } =
    actionTexts[action] || actionTexts.remove;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      aria-describedby="draggable-dialog-description"
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="draggable-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
