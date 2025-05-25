import { Box } from "@mui/material";
import ClassCard from "../components/class/ClassCard";

function Home() {
  return (
    <Box sx={{ p: 6, minHeight: "100vh" }}>
      <ClassCard />
    </Box>
  );
}

export default Home;
