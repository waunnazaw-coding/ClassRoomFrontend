import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface InstructionCardProps {
  name: string;
  instructions: string;
  onEdit: () => void;
  onDelete: () => void;
}

const InstructionCard: React.FC<InstructionCardProps> = ({
  name,
  instructions,
  onEdit,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    onEdit();
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    onDelete();
  };

  return (
    <Card sx={{ width: "100%", marginBottom: 2 }}>
      <CardHeader
        title={name}
        action={
          <>
            <IconButton
              aria-label="settings"
              aria-controls={open ? "instruction-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="instruction-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleEditClick}>Edit</MenuItem>
              <MenuItem
                onClick={handleDeleteClick}
                sx={{ color: "error.main" }}
              >
                Delete
              </MenuItem>
            </Menu>
          </>
        }
      />
      <CardContent>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
          {instructions}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InstructionCard;
