import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Breadcrumbs,
  Link as MuiLink,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreIcon,
  Add as AddIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import textColor from "../../components/common/CreateTheme";
import JoinClassDialog from "../class/JoinClassForm";
import CreateClassDialog from "../class/CreateClassForm";
import { useAuth } from "../../contexts/AuthContext";

interface HeaderProps {
  toggleSidebar: () => void;
}

type DialogType = "join" | "create" | null;

const breadcrumbNameMap: Record<string, string> = {
  dashboard: "Dashboard",
  classes: "Classes",
  archived: "Archived",
  inbox: "Inbox",
  login: "Sign In",
  signup: "Sign Up",
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const location = useLocation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const pathnames = location.pathname.split("/").filter((x) => x);

  const { isAuthenticated, user, logout } = useAuth();

  const [addMenuAnchorEl, setAddMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [accountMenuAnchorEl, setAccountMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [dialogType, setDialogType] = React.useState<DialogType>(null);

  const isAddMenuOpen = Boolean(addMenuAnchorEl);
  const isAccountMenuOpen = Boolean(accountMenuAnchorEl);

  // Breadcrumbs component
  const breadcrumbs = pathnames.length ? (
    <Breadcrumbs
      separator=" > "
      aria-label="breadcrumb"
      sx={{
        mr: 2,
        maxWidth: 300,
        overflow: "hidden",
        color: textColor,
        "& .MuiBreadcrumbs-separator": {
          color: textColor,
          userSelect: "none",
        },
      }}
    >
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const name = breadcrumbNameMap[value] || value;

        return isLast ? (
          <Typography key={to} color="text.primary" noWrap>
            {name}
          </Typography>
        ) : (
          <MuiLink
            underline="hover"
            key={to}
            color="inherit"
            component={RouterLink}
            to={to}
            noWrap
          >
            {name}
          </MuiLink>
        );
      })}
    </Breadcrumbs>
  ) : null;

  // Handlers
  const handleAddMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAddMenuAnchorEl(event.currentTarget);
  };

  const handleAddMenuClose = () => {
    setAddMenuAnchorEl(null);
  };

  const handleAccountMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleDialogOpen = (type: DialogType) => {
    setDialogType(type);
    handleAddMenuClose();
  };

  const handleDialogClose = () => {
    setDialogType(null);
  };

  const handleLogout = async () => {
    await logout();
    handleAccountMenuClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        color="default"
        sx={{
          bgcolor: "white",
          boxShadow: 2,
          color: textColor,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {/* Sidebar toggle */}
          <IconButton
            size="large"
            edge="start"
            onClick={toggleSidebar}
            color="inherit"
            aria-label="open sidebar"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Brand */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, fontWeight: "bold", color: textColor }}
          >
            FRANCO
          </Typography>

          {/* Breadcrumbs */}
          {breadcrumbs}

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Icons */}
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            {isAuthenticated ? (
              <>
                {/* Add menu */}
                <IconButton
                  size="large"
                  color="inherit"
                  aria-label="add"
                  onClick={handleAddMenuClick}
                >
                  <AddIcon />
                </IconButton>
                <Menu
                  anchorEl={addMenuAnchorEl}
                  open={isAddMenuOpen}
                  onClose={handleAddMenuClose}
                  PaperProps={{ style: { width: 200 } }}
                >
                  <MenuItem onClick={() => handleDialogOpen("join")}>
                    Join a Class
                  </MenuItem>
                  <MenuItem onClick={() => handleDialogOpen("create")}>
                    Create a New Class
                  </MenuItem>
                </Menu>

                {/* Mail */}
                <IconButton size="large" color="inherit" aria-label="mail">
                  <Badge badgeContent={4} color="error">
                    <MailIcon />
                  </Badge>
                </IconButton>

                {/* Notifications */}
                <IconButton
                  size="large"
                  color="inherit"
                  aria-label="notifications"
                >
                  <Badge badgeContent={17} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* Account */}
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleAccountMenuClick}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={accountMenuAnchorEl}
                  open={isAccountMenuOpen}
                  onClose={handleAccountMenuClose}
                >
                  <MenuItem disabled>{user?.username || "User"}</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  color="primary"
                  startIcon={<LoginIcon />}
                  sx={{
                    textTransform: "none",
                    mr: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    paddingX: 2,
                    color: textColor,
                    paddingY: 1,
                    minWidth: 100,
                    "&:hover": {
                      backgroundColor: "primary.light",
                      borderColor: "primary.main",
                      color: textColor,
                    },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    fontWeight: 600,
                    paddingX: 2,
                    paddingY: 1,
                    minWidth: 100,
                    boxShadow: "0 4px 10px rgb(25 118 210 / 0.4)",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                      boxShadow: "0 6px 14px rgb(25 118 210 / 0.6)",
                    },
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleMobileMenuOpen}
              color="inherit"
              aria-label="show more"
              aria-haspopup="true"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Dialog Components */}
      <JoinClassDialog
        open={dialogType === "join"}
        onClose={handleDialogClose}
      />
      <CreateClassDialog
        open={dialogType === "create"}
        onClose={handleDialogClose}
      />
    </Box>
  );
};

export default Header;
