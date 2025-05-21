import { Box } from "@mui/material";
import ClassCard from "../components/class/ClassCard";

function Home() {
  return (
    <Box sx={{ px: { xs: 2, sm: 3 } }}>
      <ClassCard />
    </Box>
  );
}

export default Home;
