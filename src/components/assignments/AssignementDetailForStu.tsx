import InstructionCard from "@/components/assignments/InstructionCard";
import SubmissionForm from "@/components/assignments/SubmissionForm";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";

function AssignementDetailForStu() {
  const handleEdit = () => alert("Edit assignment clicked");
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      alert("Assignment deleted");
    }
  };

  return (
    <Grid container spacing={2} sx={{ pt: 6, px: 4 }}>
      <Grid size={9}>
        <InstructionCard
          name="Assignment Name"
          instructions="These are the instructions for the assignment."
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Grid>
      <Grid size={3}>
        <Box>
          <SubmissionForm />
        </Box>
      </Grid>
    </Grid>
  );
}

export default AssignementDetailForStu;
