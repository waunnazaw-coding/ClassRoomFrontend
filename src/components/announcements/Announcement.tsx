import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LinkIcon from "@mui/icons-material/Link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import toast, { Toaster } from "react-hot-toast";

import { announcementApi } from "@/services/announcement";

interface AnnouncementCreatorProps {
  classId: number;
  onPosted?: () => void;
}

export default function AnnouncementCreator({
  classId,
  onPosted,
}: AnnouncementCreatorProps) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await announcementApi.create({
        classId,
        message: text.trim(),
      });
      toast("Announcement Create successfully.");
      setText("");
      setExpanded(false);
      onPosted?.();
    } catch (error: any) {
      console.error("Failed to post announcement:", error);

      let message = "Failed to post announcement. Please try again.";
      if (error.response?.status === 401) {
        message = "Unauthorized. Please login again.";
      } else if (error.message) {
        message = error.message;
      }
      toast("Failed to post announcement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderRadius: 2,
          boxShadow: 0.5,
          p: 2,
          width: "100%",
          mb: 2,
        }}
      >
        {!expanded ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              mb: 2,
            }}
            onClick={() => setExpanded(true)}
          >
            <Avatar
              src="https://pplx-res.cloudinary.com/image/private/user_uploads/14118900/b5d7fc82-7422-4f4f-8022-6b1af8a2d822/Screenshot-2025-05-11-215428.jpg"
              sx={{ mr: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              Announce something to your class
            </Typography>
          </Box>
        ) : (
          <Box sx={{ px: 1 }}>
            <TextareaAutosize
              minRows={4}
              placeholder="Announce something to your class"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
              style={{
                width: "100%",
                borderRadius: 0,
                borderBottom: "2px solid",
                borderColor: "#ccc",
                fontFamily: "Roboto, sans-serif",
                fontSize: 16,
                padding: 8,
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.15s ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#1976d2")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#ccc")}
            />

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <IconButton size="medium" disabled>
                  <YouTubeIcon />
                </IconButton>
                <IconButton size="medium" disabled>
                  <CloudUploadIcon />
                </IconButton>
                <IconButton size="medium" disabled>
                  <LinkIcon />
                </IconButton>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="text"
                  color="inherit"
                  onClick={() => {
                    setExpanded(false);
                    setText("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!text.trim() || loading}
                  onClick={handlePost}
                >
                  {loading ? "Posting..." : "Post"}
                </Button>
              </Stack>
            </Box>
          </Box>
        )}
      </Card>
    </>
  );
}
