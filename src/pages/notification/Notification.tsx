import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

function ToDo() {
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
            <Tab label="No Read" value="1" />
            <Tab label="Read" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Box sx={{ p: 6 }}>No Read</Box>
        </TabPanel>
        <TabPanel value="2">
          <Box sx={{ p: 6 }}>Read</Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default ToDo;
