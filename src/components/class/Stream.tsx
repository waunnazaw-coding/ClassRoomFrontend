import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { InfoOutlined } from "@mui/icons-material";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LinkIcon from "@mui/icons-material/Link";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import AllClassData from "@/components/class/AllClassData";
import AnnouncementCreator from "../announcements/Announcement";

const borderRadiusValue = 7;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  textAlign: "center",
  borderRadius: borderRadiusValue,
  color: (theme.vars ?? theme).palette.text.secondary,
  overflow: "hidden", // clip children like CardMedia
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

interface StreamProps {
  classDetail: {
    id: number;
    name: string;
    owner?: string;
    classCode?: string;
    subject?: string;
  };
  isAuthorized: boolean;
}

export default function Stream({ classDetail, isAuthorized }: StreamProps) {
  const [copied, setCopied] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(menuAnchorEl);

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleCopy = (p0: string, p1: string) => {
    if (classDetail.classCode) {
      navigator.clipboard.writeText(classDetail.classCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <Box sx={{ flexGrow: 1, p: 6, width: "100%" }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Item>
            <CardMedia
              component="img"
              height={260}
              image="https://gstatic.com/classroom/themes/img_reachout.jpg"
              alt="Random Image"
            />
            <Box
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                right: 56, // leave space for toggle button
                color: "white",
                fontWeight: "bold",
                fontSize: { xs: "1.5rem", md: "2rem" },
                textShadow: "0 0 6px rgba(0,0,0,0.7)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                userSelect: "none",
              }}
              // title={classDetail.name}
            >
              {classDetail?.name}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                px: 2,
                py: 1,
                bgcolor: "background.body",
              }}
            >
              <Box>
                <Typography>
                  <b>Class Name:</b> {classDetail?.name || "Turned off"}
                </Typography>
                <Typography mt={0.5}>
                  <b>Subject:</b> {classDetail?.subject || "-"}
                </Typography>
              </Box>
              <IconButton>
                <InfoOutlined />
              </IconButton>
            </Box>
          </Item>
        </Grid>
        <Grid size={3}>
          <Box>
            {isAuthorized ? (
              <>
                <Card variant="outlined" sx={{ mb: 2, px: 2, py: 1.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      Class code
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        aria-label="More options"
                        onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                      >
                        <MoreHorizIcon fontSize="small" />
                      </IconButton>
                      <Menu
                        anchorEl={menuAnchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            handleCopy(
                              `https://classroom.com/invite/${classDetail.classCode}`,
                              "Invite link",
                            );
                            handleMenuClose();
                          }}
                        >
                          <ListItemIcon>
                            <LinkIcon fontSize="small" />
                          </ListItemIcon>
                          Copy class invite link
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleCopy(
                              classDetail.classCode || "",
                              "Class code",
                            );
                            handleMenuClose();
                          }}
                        >
                          <ListItemIcon>
                            <ContentCopyIcon fontSize="small" />
                          </ListItemIcon>
                          Copy class code
                        </MenuItem>
                      </Menu>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "primary.main",
                        fontFamily: "monospace",
                        userSelect: "all",
                        flexGrow: 1,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {classDetail.classCode || "n4ryqzt7"}
                    </Typography>
                    <IconButton
                      size="small"
                      color="primary"
                      aria-label="Fullscreen"
                      // Add fullscreen handler if needed
                    >
                      <FullscreenIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Card>

              </>
            ) : (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    Upcoming
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Woohoo, no work due soon!
                  </Typography>
                  <Button
                    component={Link}
                    to={`/todo`}
                    variant="text"
                    size="small"
                    sx={{ mt: 1, fontWeight: 600 }}
                  >
                    View all
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>
        <Grid size={9}>
          {isAuthorized && (
            <AnnouncementCreator
              classId={classDetail?.id}
              onPosted={() => {
                console.log("Announcement posted callback");
              }}
            />
          )}
          <Box>
            <AllClassData classId={classDetail?.id} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
