import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CircularProgress from "@mui/material/CircularProgress";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { navPagesLinks, navAccLinks } from "../consts/topBar";
import { useUserData } from "../../features/auth/hooks/useUserData";
import { useLogout } from "../../features/auth/hooks/useLogout";

export const TopBar = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const { data: userData, isLoading } = useUserData();
  const location = useLocation();
  const logout = useLogout?.();

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isAuthResolving = !!token && isLoading;

  const isAuthenticated = !!userData;

  const publicAuthPaths = new Set(["/", "/login", "/register"]);
  const isPublicAuthScreen = publicAuthPaths.has(location.pathname);

  const isGuestPublicAuthScreen =
    isPublicAuthScreen && !isAuthenticated && !isLoading;

  const pagesToRender = isAuthResolving
    ? []
    : isGuestPublicAuthScreen
    ? []
    : navPagesLinks;

  const showHamburger = !isAuthResolving && !isGuestPublicAuthScreen;

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const handleAccClick = (label: string) => {
    handleCloseUserMenu();
    if (label === "Logout" && logout) logout();
    if (label !== "Logout") {
      navigate(`/${label.toLowerCase()}`);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Box width={"100%"} px={4}>
          <Toolbar disableGutters>
            <MonetizationOnIcon
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Money Planner
            </Typography>

            {showHamburger && (
              <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
                <IconButton
                  size="large"
                  aria-label="open navigation"
                  onClick={openDrawer}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}

            <MonetizationOnIcon
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            />
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                fontSize: 12,
                textDecoration: "none",
              }}
            >
              Money Planner
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pagesToRender.map((page) => (
                <Button
                  key={page.label}
                  component={RouterLink}
                  to={page.to}
                  sx={{ color: "white", display: "block" }}
                >
                  {page.label}
                </Button>
              ))}
            </Box>

            <Box
              sx={{
                flexGrow: 0,
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 120,
                justifyContent: "flex-end",
              }}
            >
              {isAuthResolving ? (
                <CircularProgress size={22} color="inherit" />
              ) : !isAuthenticated ? (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    color="inherit"
                    variant="text"
                    size="small"
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    color="inherit"
                    variant="outlined"
                    size="small"
                    sx={{ borderColor: "rgba(255,255,255,0.6)" }}
                  >
                    Register
                  </Button>
                </>
              ) : (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt="User" src="/static/images/avatar/2.jpg" />
                    </IconButton>
                  </Tooltip>

                  <Menu
                    sx={{ mt: "45px" }}
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {navAccLinks.map((setting) => (
                      <MenuItem
                        key={setting}
                        onClick={() => handleAccClick(setting)}
                      >
                        <Typography sx={{ textAlign: "center" }}>
                          {setting}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Box>
      </AppBar>

      {!isPublicAuthScreen && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={closeDrawer}
          PaperProps={{ sx: { width: 260 } }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MonetizationOnIcon />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Expense Planner
              </Typography>
            </Box>
          </Box>

          <Divider />

          <List>
            {pagesToRender.map((page) => (
              <ListItemButton
                key={page.label}
                component={RouterLink}
                to={page.to}
                onClick={closeDrawer}
              >
                <ListItemText primary={page.label} />
              </ListItemButton>
            ))}
          </List>
        </Drawer>
      )}
    </>
  );
};
