import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AssignementDetailForStu from "@/components/assignments/AssignementDetailForStu";
import AssignementDetailForTeach from "@/components/assignments/AssignmentDetailForTeach";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { getRole } from "@/services/classes";

function AssignmentDetail() {
  const { classId, assignmentId } = useParams<{
    classId: string;
    assignmentId: string;
  }>();
  const assignmentIdNum = assignmentId ? Number(assignmentId) : NaN;

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !classId) {
      setRole(null);
      setLoading(false);
      return;
    }

    async function fetchRole() {
      setLoading(true);
      try {
        const userRole = await getRole(user!.id, Number(classId));
        setRole(userRole);
      } catch (err) {
        console.error("Failed to fetch role", err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [user, classId]);

  // Loading state while auth or role data is loading
  if (authLoading || loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading assignment details...
        </Typography>
      </Box>
    );
  }

  // Invalid assignment ID
  if (isNaN(assignmentIdNum)) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error" gutterBottom>
          Invalid Assignment
        </Typography>
        <Typography variant="body2">
          The assignment you are trying to access does not exist.
        </Typography>
      </Box>
    );
  }

  // User not logged in
  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          Please Log In
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          You need to be logged in to view this assignment.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </Box>
    );
  }

  // Role-based rendering
  if (role === "Teacher") {
    return <AssignementDetailForTeach />;
  } else if (role === "Student") {
    return <AssignementDetailForStu />;
  } else {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body2">
          You do not have permission to view this assignment.
        </Typography>
      </Box>
    );
  }
}

export default AssignmentDetail;
