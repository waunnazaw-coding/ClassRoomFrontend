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
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link } from "react-router-dom";
import { generateColorScheme } from "../layout/generateColorSheme";
import EditClassModal from "./EditClassForm";
import { ClassResponseDto } from "../../types/index";
import { useAuth } from "../../contexts/AuthContext";

interface ClassCardProps {
  classes: ClassResponseDto[];
  setClasses: React.Dispatch<React.SetStateAction<ClassResponseDto[]>>;
  onUpdateClass: (
    id: number,
    updatedData: Partial<ClassResponseDto>,
  ) => Promise<void>;
  onDeleteClass: (id: number) => Promise<void>;
  onUnenrollClass: (id: number) => Promise<void>;
}

const randomImages = [
  "https://gstatic.com/classroom/themes/img_reachout.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkuRwoZD7RVhvkEU6Kpizc339O5pVlsM5lNw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM74fAUXIPLtGzNCbNgLE-Ce9iBKvlvGa-ow&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT94eF8n0RNHFzs2frZzUZDBSDZDBbX2I3bmQ&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTOysRYoTP-M-o917gIkUqbiKCJibwLOfIng&s",
];

export default function ClassCard({
  classes,
  setClasses,
  onUpdateClass,
  onDeleteClass,
  onUnenrollClass,
}: ClassCardProps) {
  const { user } = useAuth();

  const [editOpen, setEditOpen] = useState(false);
  const [editClass, setEditClass] = useState<ClassResponseDto | null>(null);

  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    color: "error" | "success";
    confirmText: string;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
    color: "error",
    confirmText: "Confirm",
  });

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuClass, setMenuClass] = useState<ClassResponseDto | null>(null);

  const handleEditClick = (cls: ClassResponseDto) => {
    setEditClass(cls);
    setEditOpen(true);
    handleMenuClose();
  };

  const handleUpdate = async (updatedData: {
    name: string;
    section?: string;
    subject?: string;
    room?: string;
  }) => {
    if (!editClass) return;
    await onUpdateClass(editClass.id, updatedData);
    setEditOpen(false);
    setEditClass(null);
  };

  const handleDeleteClick = (cls: ClassResponseDto) => {
    setConfirm({
      open: true,
      title: "Delete Class",
      description: `Are you sure you want to delete class "${cls.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        await onDeleteClass(cls.id);
        setConfirm((prev) => ({ ...prev, open: false }));
      },
      color: "error",
      confirmText: "Delete",
    });
    handleMenuClose();
  };

  const handleUnenrollClick = (cls: ClassResponseDto) => {
    setConfirm({
      open: true,
      title: "Leave Class",
      description: `Are you sure you want to leave class "${cls.name}"?`,
      onConfirm: async () => {
        await onUnenrollClass(cls.id);
        setConfirm((prev) => ({ ...prev, open: false }));
      },
      color: "success",
      confirmText: "Leave",
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
                  {(cls.role === "Teacher" || cls.role === "SubTeacher") && (
                    <Box>
                      <MenuItem onClick={() => handleEditClick(cls)}>
                        <EditIcon sx={{ mr: 1 }} fontSize="small" /> Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleDeleteClick(cls)}
                        sx={{ color: "error.main" }}
                      >
                        <DeleteForeverIcon sx={{ mr: 1 }} fontSize="small" />{" "}
                        Delete
                      </MenuItem>
                    </Box>
                  )}
                  {cls.role === "Student" && (
                    <MenuItem onClick={() => handleUnenrollClick(cls)}>
                      <ExitToAppIcon sx={{ mr: 1 }} fontSize="small" /> Leave
                    </MenuItem>
                  )}
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

                  {cls.role === "Student" && (
                    <Avatar
                      alt={cls.name}
                      sx={{
                        width: 56,
                        height: 56,
                        position: "absolute",
                        top: 110,
                        right: 20,
                        border: "3px solid #fff",
                        boxShadow: 3,
                        bgcolor: baseColor,
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "1.5rem",
                        userSelect: "none",
                      }}
                    >
                      {cls.name.charAt(0).toUpperCase()}
                    </Avatar>
                  )}

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

      {editClass && (
        <EditClassModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onUpdate={handleUpdate}
          initialData={{
            name: editClass.name,
            section: editClass.section,
            subject: editClass.subject,
            room: editClass.room,
          }}
        />
      )}

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
            color={confirm.color}
            variant="contained"
            onClick={confirm.onConfirm}
          >
            {confirm.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
