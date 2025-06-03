import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ClassCard from "../components/class/ClassCard";
import { ClassResponseDto } from "../types";
import { useAuth } from "@/contexts/AuthContext";
import {
  getClassesByUserId,
  updateClass,
  deleteClass,
  unenrollFromClass,
} from "@/services/classes";
import SchoolIcon from "@mui/icons-material/School";
import Header from "../components/layout/Header";
import { toast } from "react-toastify";

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

  // Unified update handler for edit/leave/delete
  const handleUpdateClass = async (
    id: number,
    updatedData: Partial<ClassResponseDto>,
  ) => {
    try {
      // Find the original class to fill in required fields if missing
      const originalClass = classes.find((cls) => cls.id === id);
      if (!originalClass) throw new Error("Class not found.");

      // Ensure required fields for ClassUpdateRequestDto are present
      const updatePayload = {
        name: updatedData.name ?? originalClass.name,
        section: updatedData.section ?? originalClass.section,
        subject: updatedData.subject ?? originalClass.subject,
        room: updatedData.room ?? originalClass.room,
        // Add other required fields here if needed
      };

      const updatedClass = await updateClass(id, updatePayload);
      console.log("Updated class from API:", updatedClass);
      console.log("Looking for id:", id);
      setClasses((prev) =>
        prev.map((cls) => (cls.id === updatedClass.id ? updatedClass : cls)),
      );
      //fetchClasses(); // Refresh classes 
      toast.success("Class updated successfully.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update class");
    }
  };

  const handleDeleteClass = async (id: number) => {
    try {
      await deleteClass(id);
      setClasses((prev) => prev.filter((cls) => cls.id !== id));
      toast.success("Class deleted successfully.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete class");
    }
  };

  const handleUnenrollClass = async (classId: number) => {
    try {
      if (!user) throw new Error("User is not authenticated.");
      await unenrollFromClass(classId, Number(user.id));
      setClasses((prev) => prev.filter((cls) => cls.id !== classId));
      toast.success("You have left the class.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to leave class");
    }
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
        <ClassCard
          classes={classes}
          setClasses={setClasses}
          onUpdateClass={handleUpdateClass}
          onDeleteClass={handleDeleteClass}
          onUnenrollClass={handleUnenrollClass}
        />
      )}
    </Box>
  );
}
