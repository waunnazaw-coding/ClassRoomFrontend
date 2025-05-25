import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  CardMedia,
  Skeleton,
  Avatar,
  AvatarGroup,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; 
import { unenrollFromClass } from "../../services/classes"; // Adjust path

interface ClassCardProps {
  id: number;
  name: string;
  section: string;
  classCode: string;
  subject: string;
  role: string; // "student" | "teacher" | "none"
  isDeleted: boolean;
  room: string;
  createdBy?: number;
  createdDate?: string;
  participants?: Array<{ id: number; name: string; avatarUrl?: string }>;
}

interface SelectActionCardProps {
  classes: ClassCardProps[];
  loading: boolean;
  onUnenroll?: (classId: number) => void; // callback after unenroll
}

const SelectActionCard: React.FC<SelectActionCardProps> = ({
  classes,
  loading,
  onUnenroll,
}) => {
  const { user } = useAuth();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuClassId, setMenuClassId] = useState<number | null>(null);

  const handleCardClick = (classId: number) => {
    setSelectedCard(classId);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    classId: number,
  ) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuClassId(classId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuClassId(null);
  };

  const handleUnenroll = async () => {
    if (!menuClassId || !user) return;
    try {
      await unenrollFromClass(menuClassId, user.id);
      if (onUnenroll) onUnenroll(menuClassId);
      handleMenuClose();
    } catch (error) {
      console.error("Failed to unenroll", error);
      // Optionally show toast or error message
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))",
        gap: 3,
      }}
    >
      {loading
        ? Array.from(new Array(4)).map((_, index) => (
            <Card key={index} sx={{ maxWidth: 345 }}>
              <Skeleton variant="rectangular" height={140} />
              <CardContent>
                <Skeleton variant="text" height={40} width="60%" />
                <Skeleton variant="text" height={20} width="80%" />
                <Skeleton variant="text" height={20} width="80%" />
              </CardContent>
            </Card>
          ))
        : classes.map((cls) => {
            const isStudent = cls.role === "Student";
            const isTeacher = cls.role === "Teacher";
            const participants = cls.participants || [];

            return (
              <Card
                key={cls.id}
                sx={{
                  maxWidth: 345,
                  border:
                    selectedCard === cls.id ? "2px solid #1976d2" : "none",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <CardActionArea
                  component={RouterLink}
                  to={`/classes/${cls.id}`}
                  onClick={() => handleCardClick(cls.id)}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                    alt={cls.name}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      noWrap
                    >
                      {cls.name} {cls.section && `- ${cls.section}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      Subject: {cls.subject}
                    </Typography>

                    {isStudent && participants.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Classmates:
                        </Typography>
                        <AvatarGroup max={4}>
                          {participants.map((p) => (
                            <Tooltip key={p.id} title={p.name}>
                              <Avatar
                                alt={p.name}
                                src={p.avatarUrl}
                                sx={{ width: 32, height: 32 }}
                              >
                                {p.name.charAt(0)}
                              </Avatar>
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                      </Box>
                    )}
                  </CardContent>
                </CardActionArea>

                {(isStudent || isTeacher) && (
                  <>
                    <IconButton
                      aria-label="more"
                      aria-controls="class-menu"
                      aria-haspopup="true"
                      onClick={(e) => handleMenuOpen(e, cls.id)}
                      sx={{ position: "absolute", top: 8, right: 8 }}
                    >
                      <MoreVertIcon />
                    </IconButton>

                    <Menu
                      id="class-menu"
                      anchorEl={menuAnchorEl}
                      open={Boolean(menuAnchorEl) && menuClassId === cls.id}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      {isStudent && (
                        <MenuItem onClick={handleUnenroll}>Unenroll</MenuItem>
                      )}
                      {isTeacher && (
                        <>
                          <MenuItem>Manage Class</MenuItem>
                          <MenuItem>View Participants</MenuItem>
                          {/* Add more teacher actions here */}
                        </>
                      )}
                    </Menu>
                  </>
                )}
              </Card>
            );
          })}
    </Box>
  );
};

export default SelectActionCard;
