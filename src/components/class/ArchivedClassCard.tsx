import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { generateColorScheme } from "../layout/generateColorSheme";
import { restoreClass, actualDeleteClass } from "../../services/classes";
import { ClassResponseDto } from "../../types/index";
import { useAuth } from "../../contexts/AuthContext";

interface ClassCardProps {
  archivedClasses: ClassResponseDto[];
  onRemoveClass: (id: number) => void;
}

const randomImages = [
  "https://gstatic.com/classroom/themes/img_reachout.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkuRwoZD7RVhvkEU6Kpizc339O5pVlsM5lNw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM74fAUXIPLtGzNCbNgLE-Ce9iBKvlvGa-ow&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT94eF8n0RNHFzs2frZzUZDBSDZDBbX2I3bmQ&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTOysRYoTP-M-o917gIkUqbiKCJibwLOfIng&s",
];

export default function ArchivedClassCard({
  archivedClasses,
  onRemoveClass,
}: ClassCardProps) {
  const { user } = useAuth();

  // Initialize local state with archivedClasses prop
  const [classes, setClasses] = useState<ClassResponseDto[]>(archivedClasses);

  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuClass, setMenuClass] = useState<ClassResponseDto | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    toast[type](message);
  };

  const handleRestoreClick = (cls: ClassResponseDto) => {
    setConfirm({
      open: true,
      title: "Restore Class",
      description: `Are you sure you want to restore class "${cls.name}"?`,
      onConfirm: async () => {
        try {
          await restoreClass(cls.id);
          showToast("Class restored successfully.");
          // Remove restored class from archived list
          setClasses((prev) => prev.filter((c) => c.id !== cls.id));
          onRemoveClass(cls.id);
          setConfirm((prev) => ({ ...prev, open: false }));
        } catch (error: any) {
          showToast(
            error.response?.data?.message || "Failed to restore class",
            "error",
          );
          setConfirm((prev) => ({ ...prev, open: false }));
        }
      },
    });
    handleMenuClose();
  };

  const handleDeleteClick = (cls: ClassResponseDto) => {
    setConfirm({
      open: true,
      title: "Delete Class",
      description: `Are you sure you want to permanently delete class "${cls.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        const originalClasses = [...classes];
        setClasses((prev) => prev.filter((c) => c.id !== cls.id));

        try {
          await actualDeleteClass(cls.id);
          showToast("Class Actual deleted.");
          onRemoveClass(cls.id);
        } catch (error: any) {
          setClasses(originalClasses);
          showToast(
            error.response?.data?.message || "Failed to delete class",
            "error",
          );
        } finally {
          setConfirm((prev) => ({ ...prev, open: false }));
        }
      },
    });
    handleMenuClose();
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    cls: ClassResponseDto,
  ) => {
    setMenuAnchor(event.currentTarget);
    setMenuClass(cls);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuClass(null);
  };

  return (
    <>
      <Box
        sx={{
          p: 4,
          width: "100%",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(250px, 100%), 1fr))",
          gap: 2.8,
        }}
      >
        {classes.map((cls, index) => {
          const { baseColor } = generateColorScheme(cls.name);
          const image = randomImages[index % randomImages.length];

          return (
            <Box key={cls.id}>
              <Card
                sx={{
                  position: "relative",
                  minHeight: 320,
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "box-shadow 0.3s",
                  "&:hover": { boxShadow: 8 },
                  display: "flex",
                  flexDirection: "column",
                  overflow: "visible",
                  background: "#fff",
                }}
              >
                <Box
                  sx={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}
                >
                  <Tooltip title="Options">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, cls)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor) && menuClass?.id === cls.id}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={() => handleRestoreClick(cls)}>
                    <EditIcon sx={{ mr: 1 }} fontSize="small" /> Restore
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleDeleteClick(cls)}
                    sx={{ color: "error.main" }}
                  >
                    <DeleteForeverIcon sx={{ mr: 1 }} fontSize="small" /> Delete
                  </MenuItem>
                </Menu>

                <Link
                  to={`/classes/${cls.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={image}
                    alt={cls.name}
                    sx={{
                      borderRadius: "12px 12px 0 0",
                      objectFit: "cover",
                      filter: "brightness(0.92)",
                    }}
                  />

                  <CardContent sx={{ pt: 4, pb: 2 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {cls.name}
                    </Typography>
                    {cls.subject && (
                      <Typography variant="body2" color="text.secondary">
                        {cls.subject}
                      </Typography>
                    )}
                    {cls.room && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Room: {cls.room}
                      </Typography>
                    )}
                  </CardContent>
                </Link>
              </Card>
            </Box>
          );
        })}
      </Box>

      <Dialog
        open={confirm.open}
        onClose={() => setConfirm((prev) => ({ ...prev, open: false }))}
      >
        <DialogTitle>{confirm.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirm.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirm((prev) => ({ ...prev, open: false }))}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={
              confirm.title.toLowerCase().includes("restore")
                ? "success"
                : "error"
            }
            onClick={confirm.onConfirm}
          >
            {confirm.title.toLowerCase().includes("restore")
              ? "Restore"
              : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
