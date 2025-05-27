// pages/Home.tsx
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ClassCard from "../components/class/ClassCard";
import { ClassResponseDto } from "../types";
import { useAuth } from "@/contexts/AuthContext";
import { getClassesByUserId } from "@/services/classes";
import SchoolIcon from "@mui/icons-material/School";
import Header from "../components/layout/Header";

export default function Home() {
  const { user } = useAuth();

  const [classes, setClasses] = useState<ClassResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogType, setDialogType] = useState<"join" | "create" | null>(null);

  const fetchClasses = async () => {
    if (!user) {
      setClasses([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getClassesByUserId(Number(user.id));
      const activeClasses = Array.isArray(data)
        ? data.filter((cls) => !cls.isDeleted)
        : [];
      setClasses(activeClasses);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [user]);

  const openJoinModal = () => setDialogType("join");
  const openCreateModal = () => setDialogType("create");
  const closeModal = () => setDialogType(null);

  const handleJoinSuccess = () => {
    fetchClasses();
    closeModal();
  };

  const handleCreateSuccess = (newClass: ClassResponseDto) => {
    const newClassWithRole = { ...newClass, role: "Teacher" };
    setClasses((prev) => [...prev, newClassWithRole]);
    closeModal();
  };

  return (
    <Box sx={{ width: "100%", p: 6, minHeight: "100vh" }}>
      <Header
        toggleSidebar={() => {}}
        onOpenJoinModal={openJoinModal}
        onOpenCreateModal={openCreateModal}
        dialogType={dialogType}
        onDialogClose={closeModal}
        onJoinSuccess={handleJoinSuccess}
        onCreateSuccess={handleCreateSuccess}
      />

      {loading ? (
        <Typography textAlign="center" mt={4} color="text.secondary">
          Loading your classes...
        </Typography>
      ) : classes.length === 0 ? (
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
        <ClassCard classes={classes} setClasses={setClasses} />
      )}
    </Box>
  );
}
