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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useLocation, Link as RouterLink } from "react-router-dom";
import textColor from "../../components/common/CreateTheme";

interface HeaderProps {
  toggleSidebar: () => void;
}

const breadcrumbNameMap: Record<string, string> = {
  dashboard: "Dashboard",
  classes: "Classes",
  archived: "Archived",
  inbox: "Inbox",
  login: "Sign In",
  signup: "Sign Up",
  // Add more routes and friendly names as needed
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const location = useLocation();

  // Split path into segments, ignoring empty strings
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Build dynamic breadcrumbs starting from first segment (exclude "ALPHA")
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
          color: textColor, // match separator color to header text color
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

  // Menu handlers (placeholders, implement as needed)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
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

          {/* Fixed ALPHA title */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, fontWeight: "bold", color: textColor }}
          >
            ALPHA
          </Typography>
          {breadcrumbs}

          {/* Spacer to push icons right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Right side icons */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton size="large" color="inherit" aria-label="show mails">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              aria-label="show notifications"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
            >
              <AccountCircle />
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleMobileMenuOpen}
              color="inherit"
              aria-label="show more"
              aria-controls="primary-search-account-menu-mobile"
              aria-haspopup="true"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
