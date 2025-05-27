import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Menu,
  MenuItem,
  Stack,
  Divider,
} from "@mui/material";

type AssignmentStatus = "assigned" | "turned_in" | "late" | "closed";

function SubmissionForm() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Example states - replace with real data from props or API
  const assignmentStatus: AssignmentStatus = "assigned"; // change to test different states
  const isSubmissionAllowed = assignmentStatus !== "assigned";
  const hasSubmitted =
    assignmentStatus === "assigned" || assignmentStatus === "assigned";

  const handleCreateNewClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (option: string) => {
    alert(`You selected to create a new ${option}.`);
    handleMenuClose();
  };

  // Status messages mapping
  const statusMessages: Record<AssignmentStatus, string> = {
    assigned:
      "This assignment is currently assigned. Please submit your work before the due date.",
    turned_in: "You have submitted this assignment. Good job!",
    late: "Your submission was turned in late. Please check with your instructor.",
    closed: "This assignment is closed. Submissions are no longer accepted.",
  };

  return (
    <Box>
      <Stack spacing={3}>
        {/* Submission Card */}
        <Card>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Your Work</Typography>
              <Button
                variant="contained"
                onClick={handleCreateNewClick}
                aria-controls={open ? "create-new-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                id="create-new-button"
                disabled={!isSubmissionAllowed}
              >
                Create New
              </Button>
              <Menu
                id="create-new-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{
                  "aria-labelledby": "create-new-button",
                }}
              >
                <MenuItem onClick={() => handleMenuItemClick("Link")}>
                  Link
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("File")}>
                  File
                </MenuItem>
              </Menu>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {/* Status message */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {statusMessages[assignmentStatus]}
            </Typography>

            {/* Submission summary */}
            {hasSubmitted ? (
              <Typography variant="body2" color="text.primary">
                You have submitted your work. Thank you!
              </Typography>
            ) : isSubmissionAllowed ? (
              <Typography variant="body2" color="text.secondary">
                You have not submitted anything yet. Use the "Create New" button
                above to add a submission link or upload a file.
              </Typography>
            ) : (
              <Typography variant="body2" color="error">
                Submissions are not allowed for this assignment.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

export default SubmissionForm;
