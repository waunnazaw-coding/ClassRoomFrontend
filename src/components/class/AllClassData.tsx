import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Avatar,
  Card,
  CardContent,
  Box,
  Paper,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import CampaignIcon from "@mui/icons-material/Campaign";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import * as classes from "@/services/classes";
import { ClassDetailDto, GetClassDetailsResponse } from "../../types";
import { JSX } from "react/jsx-runtime";

const iconMap: Record<string, JSX.Element> = {
  Announcement: <CampaignIcon />,
  Assignment: <AssignmentIcon />,
  Material: <DescriptionIcon />,
};

export default function AllClassData({ classId }: { classId: number }) {
  const [details, setDetails] = useState<ClassDetailDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!classId) {
      setError("Invalid class ID");
      setLoading(false);
      return;
    }

    async function fetchDetails() {
      try {
        setLoading(true);
        const data: GetClassDetailsResponse =
          await classes.getClassDetails(classId);
        setDetails(data.details ?? []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load class details.");
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [classId]);

  if (loading)
    return (
      <Typography variant="body1" align="center" sx={{ mt: 4 }}>
        Loading class details...
      </Typography>
    );

  if (error)
    return (
      <Typography variant="body1" color="error" align="center" sx={{ mt: 4 }}>
        {error}
      </Typography>
    );

  if (details.length === 0)
    return (
      <Paper
        elevation={0}
        sx={{
          textAlign: "center",
          mt: 6,
          p: 4,
          bgcolor: "#f9f9f9",
          borderRadius: 2,
          maxWidth: 400,
          mx: "auto",
        }}
        aria-label="No class activities found"
      >
        <Avatar
          sx={{
            bgcolor: "primary.light",
            width: 56,
            height: 56,
            mx: "auto",
            mb: 2,
          }}
          aria-hidden="true"
        >
          <InfoOutlinedIcon fontSize="large" />
        </Avatar>
        <Typography variant="h6" gutterBottom>
          No Activities Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          There are currently no announcements, assignments, or materials for
          this class. Please check back later.
        </Typography>
      </Paper>
    );

  return (
    <Stack spacing={2}>
      {details.map((item) => {
        const entityTypeLower = item.entityType?.toLowerCase() ?? "unknown";
        const isNavigable =
          entityTypeLower === "assignment" || entityTypeLower === "material";

        const formattedDate = item.activityDate
          ? new Date(item.activityDate).toLocaleString()
          : "Unknown date";

        // Only set RouterLink and "to" if navigable
        const cardProps = isNavigable
          ? {
              component: RouterLink,
              to: `${entityTypeLower}/${item.entityId}`,
            }
          : {
              component: "div",
            };

        return (
          <Card
            key={item.entityId}
            {...cardProps}
            sx={{
              borderRadius: 1,
              boxShadow: 0.5,
              textDecoration: "none",
              color: "inherit",
              cursor: isNavigable ? "pointer" : "default",
              "&:hover": isNavigable
                ? {
                    boxShadow: 4,
                    bgcolor: "action.hover",
                  }
                : {},
            }}
            variant="outlined"
            aria-label={`${item.entityType} - ${item.content}`}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar
                  sx={{ bgcolor: "primary.main" }}
                  variant="rounded"
                  aria-label={item.entityType}
                >
                  {iconMap[item.entityType] ?? <CampaignIcon />}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" fontWeight="medium" noWrap>
                    {item.content ?? "Untitled"}
                  </Typography>
                  {item.messageContent && (
                    <Box
                      sx={{
                        backgroundColor: "#f5f5f5",
                        padding: "4px 8px",
                        borderRadius: 1,
                        mt: 0.5,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      <Typography variant="body2">
                        {item.messageContent}
                      </Typography>
                    </Box>
                  )}
                  <Typography variant="caption" color="text.secondary" mt={0.5}>
                    {formattedDate}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}
