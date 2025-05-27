import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

function ToDo() {
  const assignmentName = "Chapter 3: Quadratic Equations";
  const assignmentInstructions = `Please complete all exercises on pages 45-50.\nSubmit your answers as a single PDF file.\nMake sure to show all your work.`;

  const handleEdit = () => {
    alert("Edit assignment clicked");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      alert("Assignment deleted");
    }
  };
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        typography: "body1",
        minHeight: "100vh",
      }}
    >
      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 2,
            borderColor: "divider",
            position: "fixed",
            width: "100%",
            zIndex: 1,
            backgroundColor: "background.paper",
          }}
        >
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Assigned" value="1" />
            <Tab label="Missing" value="2" />
            <Tab label="Done" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Box sx={{ p: 6 }}>Assigned</Box>
        </TabPanel>
        <TabPanel value="2">
          <Box sx={{ px: 0, pt: 6, pb: 2 }}>Missing</Box>
        </TabPanel>
        <TabPanel value="3">
          <Box sx={{ px: 0, pt: 6, pb: 2 }}>Done</Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default ToDo;
