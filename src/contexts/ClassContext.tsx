import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";
import {
  ClassRequestDto,
  ClassResponseDto,
  ClassUpdateRequestDto,
  GetClassDetailsResponse,
  TopicWithMaterialsAssignmentsDto,
  UserDto,
  ClassDetailDto,
} from "../types/index";
import * as classApi from "../services/classes"; // Your API functions

interface ClassContextType {
  // State
  classes: ClassResponseDto[];
  currentClassDetails: GetClassDetailsResponse | null;
  classDetailsList: ClassDetailDto[]; // Flattened details array
  participants: UserDto[];
  topics: TopicWithMaterialsAssignmentsDto[];
  loading: boolean;
  error: string | null;

  // Actions
  createClass: (data: ClassRequestDto) => Promise<void>;
  getClassDetails: (classId: number) => Promise<void>;
  enrollInClass: (classCode: string, studentId: number) => Promise<void>;
  updateClass: (id: number, data: ClassUpdateRequestDto) => Promise<void>;
  deleteClass: (id: number) => Promise<void>;
  restoreClass: (id: number) => Promise<void>;
  actualDeleteClass: (id: number) => Promise<void>;
  unenrollFromClass: (classId: number, studentId: number) => Promise<void>;
  getClassParticipants: (classId: number) => Promise<void>;
  getTopicsWithMaterialsAndAssignments: (classId: number) => Promise<void>;
  addSubTeacherToClass: (
    teacherUserId: number,
    classId: number,
    email: string,
  ) => Promise<void>;
  addStudentToClass: (
    teacherUserId: number,
    classId: number,
    email: string,
  ) => Promise<void>;
  transferClassOwnership: (
    classId: number,
    currentOwnerId: number,
    newOwnerId: number,
  ) => Promise<void>;
  removeSubTeacherFromClass: (
    classId: number,
    subTeacherId: number,
  ) => Promise<void>;
  removeStudentFromClass: (classId: number, studentId: number) => Promise<void>;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const ClassProvider = ({ children }: { children: ReactNode }) => {
  const [classes, setClasses] = useState<ClassResponseDto[]>([]);
  const [currentClassDetails, setCurrentClassDetails] =
    useState<GetClassDetailsResponse | null>(null);
  const [classDetailsList, setClassDetailsList] = useState<ClassDetailDto[]>(
    [],
  );
  const [participants, setParticipants] = useState<UserDto[]>([]);
  const [topics, setTopics] = useState<TopicWithMaterialsAssignmentsDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown error";
    setError(message);
    throw error;
  };

  const createClass = async (data: ClassRequestDto) => {
    setLoading(true);
    setError(null);
    try {
      const newClass = await classApi.createClass(data);
      setClasses((prev) => [...prev, newClass]);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const getClassDetails = async (classId: number) => {
    setLoading(true);
    setError(null);
    try {
      const details = await classApi.getClassDetails(classId);
      setCurrentClassDetails(details);
      setClassDetailsList(details.details ?? []);

      // Fetch participants and topics in parallel
      const [participantsData, topicsData] = await Promise.all([
        classApi.getClassParticipants(classId),
        classApi.getTopicsWithMaterialsAndAssignments(classId),
      ]);
      setParticipants(participantsData);
      setTopics(topicsData);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const enrollInClass = async (classCode: string, studentId: number) => {
    setLoading(true);
    setError(null);
    try {
      await classApi.enrollInClass(classCode, studentId);
      if (currentClassDetails) {
        const updatedParticipants = await classApi.getClassParticipants(
          currentClassDetails.details[0]?.id || 0,
        );
        setParticipants(updatedParticipants);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateClass = async (id: number, data: ClassUpdateRequestDto) => {
    setLoading(true);
    setError(null);
    try {
      const updatedClass = await classApi.updateClass(id, data);
      setClasses((prev) =>
        prev.map((cls) => (cls.id === id ? updatedClass : cls)),
      );
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteClass = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await classApi.deleteClass(id);
      setClasses((prev) => prev.filter((cls) => cls.id !== id));
      if (currentClassDetails && currentClassDetails.details[0]?.id === id) {
        setCurrentClassDetails(null);
        setClassDetailsList([]);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const restoreClass = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await classApi.restoreClass(id);
      // Optionally refresh class list or details here
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const actualDeleteClass = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await classApi.actualDeleteClass(id);
      setClasses((prev) => prev.filter((cls) => cls.id !== id));
      if (currentClassDetails && currentClassDetails.details[0]?.id === id) {
        setCurrentClassDetails(null);
        setClassDetailsList([]);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const unenrollFromClass = async (classId: number, studentId: number) => {
    setLoading(true);
    setError(null);
    try {
      await classApi.unenrollFromClass(classId, studentId);
      if (currentClassDetails) {
        const updatedParticipants =
          await classApi.getClassParticipants(classId);
        setParticipants(updatedParticipants);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const getClassParticipants = async (classId: number) => {
    setLoading(true);
    setError(null);
    try {
      const participantsData = await classApi.getClassParticipants(classId);
      setParticipants(participantsData);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const getTopicsWithMaterialsAndAssignments = async (classId: number) => {
    setLoading(true);
    setError(null);
    try {
      const topicsData =
        await classApi.getTopicsWithMaterialsAndAssignments(classId);
      setTopics(topicsData);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const addSubTeacherToClass = async (
    teacherUserId: number,
    classId: number,
    email: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await classApi.addSubTeacherToClass(teacherUserId, classId, email);
      await getClassParticipants(classId);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const addStudentToClass = async (
    teacherUserId: number,
    classId: number,
    email: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await classApi.addStudentToClass(teacherUserId, classId, email);
      await getClassParticipants(classId);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const transferClassOwnership = async (
    classId: number,
    currentOwnerId: number,
    newOwnerId: number,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await classApi.transferClassOwnership(
        classId,
        currentOwnerId,
        newOwnerId,
      );
      await getClassDetails(classId);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const removeSubTeacherFromClass = async (
    classId: number,
    subTeacherId: number,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await classApi.removeSubTeacherFromClass(classId, subTeacherId);
      await getClassParticipants(classId);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const removeStudentFromClass = async (classId: number, studentId: number) => {
    setLoading(true);
    setError(null);
    try {
      await classApi.removeStudentFromClass(classId, studentId);
      await getClassParticipants(classId);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      classes,
      currentClassDetails,
      classDetailsList,
      participants,
      topics,
      loading,
      error,
      createClass,
      getClassDetails,
      enrollInClass,
      updateClass,
      deleteClass,
      restoreClass,
      actualDeleteClass,
      unenrollFromClass,
      getClassParticipants,
      getTopicsWithMaterialsAndAssignments,
      addSubTeacherToClass,
      addStudentToClass,
      transferClassOwnership,
      removeSubTeacherFromClass,
      removeStudentFromClass,
    }),
    [
      classes,
      currentClassDetails,
      classDetailsList,
      participants,
      topics,
      loading,
      error,
    ],
  );

  return (
    <ClassContext.Provider value={value}>{children}</ClassContext.Provider>
  );
};

export const useClassContext = (): ClassContextType => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClassContext must be used within a ClassProvider");
  }
  return context;
};
