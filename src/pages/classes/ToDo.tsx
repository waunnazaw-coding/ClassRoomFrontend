import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import FormControl from "@mui/material/FormControl";
import { InputLabel, Select, SelectChangeEvent, MenuItem } from "@mui/material";

function ToDo() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // Example topics for student select box - replace with real data
  const topics = [
    { id: 1, name: "Algebra" },
    { id: 2, name: "Geometry" },
    { id: 3, name: "Trigonometry" },
  ];

  const [selectedTopic, setSelectedTopic] = React.useState<number | "">("");

  const handleTopicChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedTopic(value === "" ? "" : Number(value));
    alert(`Selected topic ID: ${value}`);
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
        {/* Fixed TabList */}
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

        {/* Content below fixed tabs */}
        <Box
          sx={{
            maxWidth: 300,
            px: 6,
            pt: 8,
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="topic-select-label">Select Topic</InputLabel>
            <Select
              labelId="topic-select-label"
              id="topic-select"
              value={selectedTopic === "" ? "" : selectedTopic.toString()}
              label="Select Topic"
              onChange={handleTopicChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {topics.map((topic) => (
                <MenuItem key={topic.id} value={topic.id.toString()}>
                  {topic.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Tab Panels with consistent padding */}
          <TabPanel value="1" sx={{ p: 3 }}>
            Assigned
          </TabPanel>
          <TabPanel value="2" sx={{ p: 3 }}>
            Missing
          </TabPanel>
          <TabPanel value="3" sx={{ p: 3 }}>
            Done
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  );
}

export default ToDo;
