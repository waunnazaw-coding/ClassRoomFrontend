import * as React from "react";
import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/SideBar";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <CssBaseline />
      <Header toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar open={sidebarOpen} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: "64px",
            minHeight: "100vh",
            overflowX: "hidden",
            // px: { xs: 2, sm: 3 },
            transition: "margin-left 0.3s",
          }}
          aria-label="main content"
        >
          <Box sx={{ width: "100%", maxWidth: 1200, py: 3 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
