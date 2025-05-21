import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ScheduleIcon from "@mui/icons-material/Schedule";
import GroupIcon from "@mui/icons-material/Group";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import { SitemarkIcon } from "./CustomIcons";

const features = [
  {
    icon: <ScheduleIcon color="action" />,
    title: "Flexible Scheduling",
    description: "Create and manage class schedules tailored to your needs.",
  },
  {
    icon: <GroupIcon color="action" />,
    title: "Student Management",
    description: "Easily track attendance, grades, and progress.",
  },
  {
    icon: <DashboardIcon color="action" />,
    title: "Intuitive Dashboard",
    description: "Access assignments, reports, and notifications at a glance.",
  },
  {
    icon: <BarChartIcon color="action" />,
    title: "Advanced Analytics",
    description: "Gain insights to improve teaching and learning outcomes.",
  },
];

export default function Content() {
  return (
    <Stack
      sx={{
        maxWidth: 400,
        gap: 4,
        alignSelf: "center",
        px: { xs: 2, md: 0 },
      }}
    >
      <Box
        sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center" }}
      >
        <SitemarkIcon />
      </Box>
      <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
        Welcome to Alpha
      </Typography>
      {features.map(({ icon, title, description }, index) => (
        <Stack key={index} direction="row" spacing={2} alignItems="flex-start">
          {icon}
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 320 }}
            >
              {description}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
