import ArchivedClassCard from "@/components/class/ArchivedClassCard";
import { useAuth } from "@/contexts/AuthContext";
import { getClassesByUserId } from "@/services/classes";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import SchoolIcon from "@mui/icons-material/School";
import { ClassResponseDto } from "@/types/index";

function ArchivedClass() {
  const { user } = useAuth();
  const [archivedClasses, setArchivedClasses] = useState<ClassResponseDto[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setArchivedClasses([]);
      return;
    }

    setLoading(true);
    getClassesByUserId(Number(user.id))
      .then((data) => {
        const archived = data.filter((cls) => cls.isDeleted);
        console.log(archived);
        setArchivedClasses(archived);
      })
      .catch((error) => {
        console.error("Failed to fetch archived classes:", error);
      })
      .finally(() => setLoading(false));
  }, [user]);
  return (
    <Box sx={{ width: "100%", px: { xs: 1.5, sm: 2 }, py: { xs: 1.5, sm: 2 } }}>
      {loading ? (
        <Typography textAlign="center" mt={4} color="text.secondary">
          Loading your classes...
        </Typography>
      ) : archivedClasses.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mt: 8,
            color: "text.secondary",
          }}
        >
          <SchoolIcon sx={{ fontSize: 60, mb: 2, color: "primary.main" }} />
          <Typography variant="h6" gutterBottom>
            No classes found
          </Typography>
          <Typography variant="body1" maxWidth={400} textAlign="center">
            You don’t have any classes yet. Start by creating a new class or
            joining one to get started!
          </Typography>
        </Box>
      ) : (
        <ArchivedClassCard
          archivedClasses={archivedClasses}
          onRemoveClass={(id) =>
            setArchivedClasses((prev) => prev.filter((cls) => cls.id !== id))
          }
        />
      )}
    </Box>
  );
}

export default ArchivedClass;
