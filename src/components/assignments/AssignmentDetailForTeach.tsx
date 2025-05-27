import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import StudentWork from "@/components/assignments/StudentWork";
import InstructionCard from "@/components/assignments/InstructionCard";
import { useParams } from "react-router-dom";

function AssignmentDetail() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const assignmentIdNum = assignmentId ? Number(assignmentId) : NaN;

  if (isNaN(assignmentIdNum)) {
    return (
      <Box sx={{ p: 4 }}>
        <p>Invalid assignment ID.</p>
      </Box>
    );
  }

  const assignmentName = `Assignment #${assignmentIdNum} - Chapter 3: Quadratic Equations`;
  const assignmentInstructions = `Please complete all exercises on pages 45-50.\nSubmit your answers as a single PDF file.\nMake sure to show all your work.`;

  const handleEdit = () => alert("Edit assignment clicked");
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
            <Tab label="Instructions" value="1" />
            <Tab label="Student Work" value="2" />
          </TabList>
        </Box>
        <Box sx={{ pt: 6 }}>
          <TabPanel value="1">
            <Box sx={{ px: 6, pb: 4 }}>
              <InstructionCard
                name={assignmentName}
                instructions={assignmentInstructions}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Box>
          </TabPanel>
          <TabPanel value="2">
            <Box>
              <StudentWork />
            </Box>
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  );
}

export default AssignmentDetail;
