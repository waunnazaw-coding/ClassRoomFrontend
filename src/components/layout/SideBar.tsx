import * as React from "react";
import { useState } from "react";
import {
  Dashboard,
  School,
  MenuBook,
  Inbox,
  Archive,
  Login,
  AppRegistration,
  ExpandLess,
  ExpandMore,
  LocalLibrary,
  TrendingUp,
  Replay,
  LocalShipping,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
} from "@mui/material";
import textColor from "../../components/common/CreateTheme";
import { Link as RouterLink } from "react-router-dom";

interface SidebarProps {
  open: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const [openTeaching, setOpenTeaching] = useState(false);
  const [openEnrolled, setOpenEnrolled] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isSidebarOpen = open || hovered;

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        width: isSidebarOpen ? 280 : 60,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxShadow: 1,
        transition: "width 0.3s",
        "& .MuiDrawer-paper": {
          width: isSidebarOpen ? 280 : 60,
          boxSizing: "border-box",
          overflowX: "hidden",
          transition: "width 0.5s",
        },
      }}
      PaperProps={{ "aria-label": "Sidebar navigation" }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", color: textColor }}>
        <List>
          {/* Dashboard */}
          <Tooltip title={!isSidebarOpen ? "Dashboard" : ""} placement="right">
            <ListItemButton
              component={RouterLink}
              to="/"
              sx={{ color: textColor }}
            >
              <ListItemIcon sx={{ color: textColor }}>
                <Dashboard />
              </ListItemIcon>
              {isSidebarOpen && <ListItemText primary="Dashboard" />}
            </ListItemButton>
          </Tooltip>

          {/* Teaching - collapsible */}
          <Tooltip title={!isSidebarOpen ? "Teaching" : ""} placement="right">
            <ListItemButton
              onClick={() => setOpenTeaching((prev) => !prev)}
              aria-expanded={openTeaching}
              aria-controls="teaching-collapse"
              sx={{ color: textColor }}
            >
              <ListItemIcon sx={{ color: textColor }}>
                <School />
              </ListItemIcon>
              {isSidebarOpen && <ListItemText primary="Teaching" />}
              {isSidebarOpen &&
                (openTeaching ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </Tooltip>
          <Collapse
            in={openTeaching && isSidebarOpen}
            timeout="auto"
            unmountOnExit
            id="teaching-collapse"
          >
            <List component="div" disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/teaching/courses"
                sx={{ pl: 4, color: textColor }}
              >
                <ListItemIcon sx={{ color: textColor }}>
                  <MenuBook />
                </ListItemIcon>
                <ListItemText primary="Courses" />
              </ListItemButton>
              <ListItemButton
                component={RouterLink}
                to="/teaching/progress"
                sx={{ pl: 4, color: textColor }}
              >
                <ListItemIcon sx={{ color: textColor }}>
                  <TrendingUp />
                </ListItemIcon>
                <ListItemText primary="Progress" />
              </ListItemButton>
              <ListItemButton
                component={RouterLink}
                to="/teaching/refunds"
                sx={{ pl: 4, color: textColor }}
              >
                <ListItemIcon sx={{ color: textColor }}>
                  <Replay />
                </ListItemIcon>
                <ListItemText primary="Refunds" />
              </ListItemButton>
              <ListItemButton
                component={RouterLink}
                to="/teaching/shipping"
                sx={{ pl: 4, color: textColor }}
              >
                <ListItemIcon sx={{ color: textColor }}>
                  <LocalShipping />
                </ListItemIcon>
                <ListItemText primary="Shipping" />
              </ListItemButton>
            </List>
          </Collapse>

          <Divider sx={{ my: 1 }} />

          {/* Enrolled - collapsible */}
          <Tooltip title={!isSidebarOpen ? "Enrolled" : ""} placement="right">
            <ListItemButton
              onClick={() => setOpenEnrolled((prev) => !prev)}
              aria-expanded={openEnrolled}
              aria-controls="enrolled-collapse"
              sx={{ color: textColor }}
            >
              <ListItemIcon sx={{ color: textColor }}>
                <LocalLibrary />
              </ListItemIcon>
              {isSidebarOpen && <ListItemText primary="Enrolled" />}
              {isSidebarOpen &&
                (openEnrolled ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </Tooltip>
          <Collapse
            in={openEnrolled && isSidebarOpen}
            timeout="auto"
            unmountOnExit
            id="enrolled-collapse"
          >
            <List component="div" disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/enrolled/courses"
                sx={{ pl: 4, color: textColor }}
              >
                <ListItemIcon sx={{ color: textColor }}>
                  <MenuBook />
                </ListItemIcon>
                <ListItemText primary="Courses" />
              </ListItemButton>
              <ListItemButton
                component={RouterLink}
                to="/enrolled/progress"
                sx={{ pl: 4, color: textColor }}
              >
                <ListItemIcon sx={{ color: textColor }}>
                  <TrendingUp />
                </ListItemIcon>
                <ListItemText primary="Progress" />
              </ListItemButton>
              {/* Add more enrolled sub-items here if needed */}
            </List>
          </Collapse>

          <Divider sx={{ my: 1 }} />

          {/* Inbox */}
          <Tooltip title={!isSidebarOpen ? "Inbox" : ""} placement="right">
            <ListItemButton
              component={RouterLink}
              to="/inbox"
              sx={{ color: textColor }}
            >
              <ListItemIcon sx={{ color: textColor }}>
                <Inbox />
              </ListItemIcon>
              {isSidebarOpen && <ListItemText primary="Inbox" />}
            </ListItemButton>
          </Tooltip>

          {/* Archived */}
          <Tooltip title={!isSidebarOpen ? "Archived" : ""} placement="right">
            <ListItemButton
              component={RouterLink}
              to="/archived"
              sx={{ color: textColor }}
            >
              <ListItemIcon sx={{ color: textColor }}>
                <Archive />
              </ListItemIcon>
              {isSidebarOpen && <ListItemText primary="Archived" />}
            </ListItemButton>
          </Tooltip>

          <Divider sx={{ my: 1 }} />

          {/* Sign In */}
          <Tooltip title={!isSidebarOpen ? "Sign In" : ""} placement="right">
            <ListItemButton
              component={RouterLink}
              to="/login"
              sx={{ color: textColor }}
            >
              <ListItemIcon sx={{ color: textColor }}>
                <Login />
              </ListItemIcon>
              {isSidebarOpen && <ListItemText primary="Sign In" />}
            </ListItemButton>
          </Tooltip>

          {/* Sign Up */}
          <Tooltip title={!isSidebarOpen ? "Sign Up" : ""} placement="right">
            <ListItemButton
              component={RouterLink}
              to="/signup"
              sx={{ color: textColor }}
            >
              <ListItemIcon sx={{ color: textColor }}>
                <AppRegistration />
              </ListItemIcon>
              {isSidebarOpen && <ListItemText primary="Sign Up" />}
            </ListItemButton>
          </Tooltip>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
