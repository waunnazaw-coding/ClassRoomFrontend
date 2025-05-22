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
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreIcon,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddIcon from "@mui/icons-material/Add";
import textColor from "../../components/common/CreateTheme";
import JoinClassDialog from "../class/JoinClassForm";
import CreateClassDialog from "../class/CreateClassForm";

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

  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null,
  );
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [dialogType, setDialogType] = React.useState<DialogType>(null);

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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDialogOpen = (type: DialogType) => {
    setDialogType(type);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setDialogType(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
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

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, fontWeight: "bold", color: textColor }}
          >
            FRANCO
          </Typography>

          {breadcrumbs}

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuClick}
            >
              <AddIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              PaperProps={{ style: { width: 200 } }}
            >
              <MenuItem onClick={() => handleDialogOpen("join")}>
                Join a Class
              </MenuItem>
              <MenuItem onClick={() => handleDialogOpen("create")}>
                Create a New Class
              </MenuItem>
            </Menu>

            <IconButton size="large" color="inherit" aria-label="mails">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" color="inherit" aria-label="notifications">
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="account"
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
