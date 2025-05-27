import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Stream from "./Stream";
import ClassWork from "./ClassWork";
import People from "./People";
import Grade from "./Grade";
import { useEffect, useState } from "react";
import { getClassById } from "../../services/classes";
import { getRole } from "@/services/classes";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function ClassDetailCard({ classId }: { classId: string | number }) {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [value, setValue] = React.useState("1");
  const [classDetail, setClassDetail] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!classId) {
      setError("Invalid class ID");
      setLoading(false);
      return;
    }

    let isMounted = true;
    const classIdNum = Number(classId);

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch class detail
        const classData = await getClassById(classIdNum);
        if (!isMounted) return;
        setClassDetail(classData);

        // Fetch user role in class
        if (!user) {
          setRole(null);
          setLoading(false);
          return;
        }
        const userRole = await getRole(user.id, classIdNum);
        if (!isMounted) return;
        setRole(userRole);
      } catch (err) {
        console.error(err);
        if (!isMounted) return;
        setError("Failed to load class data or user role.");
        setRole(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [classId, user]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (authLoading || loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <p>Loading class details...</p>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "error.main" }}>
        <p>{error}</p>
      </Box>
    );
  }

  if (!user) {
    // Redirect to login or show message
    navigate("/login");
    return null;
  }

  if (!role) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <p>You do not have permission to view this class.</p>
      </Box>
    );
  }

  // Determine role flags
  const isTeacher = role.toLowerCase() === "teacher";
  const isSubTeacher = role.toLowerCase() === "subteacher";
  const isStudent = role.toLowerCase() === "student";

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
            backgroundColor: "white",
            zIndex: 1,
          }}
        >
          <TabList onChange={handleChange} aria-label="class detail tabs">
            <Tab label="Stream" value="1" />
            <Tab label="Class Work" value="2" />
            <Tab label="People" value="3" />
            {(isTeacher || isSubTeacher) && <Tab label="Grade" value="4" />}
          </TabList>
        </Box>

        <Box>
          {value === "1" && (
            <TabPanel value="1">
              <Stream
                classDetail={classDetail}
                isAuthorized={isTeacher || isSubTeacher}
              />
            </TabPanel>
          )}
          {value === "2" && (
            <TabPanel value="2">
              <ClassWork role={role} userId={user.id} />
            </TabPanel>
          )}
          {value === "3" && (
            <TabPanel value="3">
              <People />
            </TabPanel>
          )}
          {(isTeacher || isSubTeacher) && value === "4" && (
            <TabPanel value="4">
              <Grade />
            </TabPanel>
          )}
        </Box>
      </TabContext>
    </Box>
  );
}

export default ClassDetailCard;
