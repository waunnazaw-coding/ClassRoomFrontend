import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Stream from "./Stream";
import ClassWork from "./ClassWork";
import People from "./People";

function ClassDetailCard() {
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
            <Tab label="Stream" value="1" />
            <Tab label="Class Work" value="2" />
            <Tab label="People" value="3" />
            <Tab label="Grade" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Stream />
        </TabPanel>
        <TabPanel value="2">
          <ClassWork />
        </TabPanel>
        <TabPanel value="3">
          <People />
        </TabPanel>
        <TabPanel value="4">Item Four</TabPanel>
      </TabContext>
    </Box>
  );
}

export default ClassDetailCard;
