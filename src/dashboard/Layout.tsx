import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h1" noWrap sx={{ fontSize: "2rem" }}>
            Megamind
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Drawer open={isDrawerOpen} onClose={toggleDrawer}>
        <List>
          <ListItem>
            <ListItemButton href="/">
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton href="/create-policy">
              <ListItemText primary="Create Policy" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton href="/saved-policy">
              <ListItemText primary="Saved Policy" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box sx={{ width: "100vw", height: "100vh", mt: "7rem" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
