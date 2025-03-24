import { Link } from "react-router";
import { Button, Box, Typography } from "@mui/material";

export default function DashboardMain() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        // backgroundColor: "#111",
        borderRadius: 2,
        p: 4,
      }}
    >
      <Typography
        variant="h2"
        noWrap
        sx={{ fontSize: "2rem", textTransform: "uppercase" }}
      >
        Policy Creation System
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to="/create-policy"
        color="primary"
      >
        Create Policy
      </Button>
      <Button
        variant="contained"
        component={Link}
        to="/saved-policy"
        color="primary"
      >
        View Created Policy
      </Button>
    </Box>
  );
}
