import React from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HomeIcon from "@mui/icons-material/Home";

export default function ErrorPage() {
  const error = useRouteError();

  let title = "Oops!";
  let message = "Sorry, an unexpected error has occurred.";
  let IconComponent = ErrorOutlineIcon;
  let iconColor = "error.main";

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        title = "404 - Page Not Found";
        message = "Sorry, the page you are looking for does not exist.";
        IconComponent = ReportProblemIcon;
        iconColor = "warning.main";
        break;
      case 401:
        title = "Unauthorized";
        message = "You do not have access to this page.";
        IconComponent = LockOutlinedIcon;
        iconColor = "info.main";
        break;
      case 500:
        title = "Server Error";
        message = "Sorry, something went wrong on our end.";
        IconComponent = ErrorOutlineIcon;
        iconColor = "error.main";
        break;
      default:
        title = `${error.status} ${error.statusText}`;
        message = error.data?.message || message;
        IconComponent = ErrorOutlineIcon;
        iconColor = "error.main";
        break;
    }
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
        bgcolor: "background.default",
      }}
    >
      <Card
        elevation={6}
        sx={{
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
          p: 4,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <IconComponent sx={{ fontSize: 80, color: iconColor, mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {message}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            sx={{ textTransform: "none" }}
          >
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
