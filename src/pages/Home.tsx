import { Box } from "@mui/material";
import ClassCard from "../components/class/ClassCard";
import {useClassContext} from "../contexts/ClassContext";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { ClassResponseDto } from "@/types";

function Home() {
  const { classes } = useClassContext();

  return (
    <Box sx={{ p: 6, minHeight: "100vh" }}>
      <ClassCard  classes={classes} loading={false}/>
    </Box>
  );
}

export default Home;
