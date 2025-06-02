// export interface AssignmentCreateRequest {
//   classId: number;
//   createNewTopic: boolean;
//   newTopicTitle?: string | null;
//   selectedTopicId?: number | null;
//   assignmentTitle: string;
//   instructions?: string | null;
//   points: number;
//   dueDate?: string | null;
//   allowLateSubmission?: boolean;
//   studentIds?: number[] | null;
//   attachments?: {
//     fileType: string;
//     fileUrl?: string | null;
//     filePath?: string | null;
//   }[];
//   createdByUserId: number;
// }

// export interface AssignmentCreateResponse {
//   assignmentId: number;
//   classWorkId: number;
//   topicId?: number | null;
// }

// import axiosInstance from "./axiosInstance";

// export async function createAssignment(
//   // classId: number,
//   data: AssignmentCreateRequest
// ): Promise<AssignmentCreateResponse> {
//   const response = await axiosInstance.post<AssignmentCreateResponse>(
//     `/assignments/create`,
//     data
//   );
//   return response.data;
// }

import api from "@/services/axiosInstance"; // Your configured Axios instance

// Types for clarity (adjust as needed)
type Attachment = {
  type: "YouTube" | "Link" | "Upload";
  value: string;
  fileObj?: File;
};

interface AssignmentCreatePayload {
  classId: number;
  createNewTopic: boolean;
  newTopicTitle?: string;
  selectedTopicId?: number;
  assignmentTitle: string;
  instructions?: string;
  points?: number;
  dueDate?: string | Date;
  allowLateSubmission: boolean;
  studentIds?: number[];
  attachments?: Attachment[];
}

export async function createAssignment(payload: AssignmentCreatePayload) {
  const formData = new FormData();

  // Required fields
  formData.append("ClassId", payload.classId.toString());
  formData.append("CreateNewTopic", String(payload.createNewTopic));
  formData.append("AssignmentTitle", payload.assignmentTitle);
  formData.append("AllowLateSubmission", String(payload.allowLateSubmission));

  // Optional fields
  if (payload.newTopicTitle)
    formData.append("NewTopicTitle", payload.newTopicTitle);
  if (payload.selectedTopicId !== undefined && payload.selectedTopicId !== null)
    formData.append("SelectedTopicId", String(payload.selectedTopicId));
  if (payload.instructions)
    formData.append("Instructions", payload.instructions);
  if (payload.points !== undefined && payload.points !== null)
    formData.append("Points", String(payload.points));
  if (payload.dueDate)
    formData.append(
      "DueDate",
      typeof payload.dueDate === "string"
        ? payload.dueDate
        : payload.dueDate.toISOString(),
    );

  // Student IDs (if not all students)
  if (payload.studentIds && payload.studentIds.length > 0) {
    payload.studentIds.forEach((id, idx) => {
      formData.append(`StudentIds[${idx}]`, String(id));
    });
  }

  // Attachments
  if (payload.attachments && payload.attachments.length > 0) {
    payload.attachments.forEach((att, idx) => {
      // FileType
      let fileType: string;
      switch (att.type) {
        case "YouTube":
          fileType = "YouTube";
          break;
        case "Link":
          fileType = "Link";
          break;
        case "Upload":
          fileType = "Upload";
          break;
        default:
          throw new Error("Unknown attachment type: " + att.type);
      }
      formData.append(`Attachments[${idx}].FileType`, fileType);

      // FileUrl for YouTube/Link
      if ((fileType === "YouTube" || fileType === "Link") && att.value) {
        formData.append(`Attachments[${idx}].FileUrl`, att.value);
      }

      // FileUpload for actual files
      if (fileType === "Upload" && att.fileObj) {
        formData.append(
          `Attachments[${idx}].FileUpload`,
          att.fileObj,
          att.fileObj.name,
        );
      }
    });
  }

  // Use Axios instance to send as multipart/form-data
  const response = await api.post("/assignments/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
