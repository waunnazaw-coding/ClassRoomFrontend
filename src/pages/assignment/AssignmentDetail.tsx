import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

function AssignmentDetail() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        maxWidth: "1200px",
        typography: "body1",
        position: "fixed",
      }}
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 2, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Instrunctions" value="1" />
            <Tab label="Student Work" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">Instructions</TabPanel>
        <TabPanel value="2">Student Work</TabPanel>
      </TabContext>
    </Box>
  );
}

export default AssignmentDetail;
