import axiosInstance from "./axiosInstance";
import type { TopicDto, CreateTopicDto } from "../types/index";

export async function createTopic(
  createDto: CreateTopicDto,
): Promise<TopicDto> {
  const response = await axiosInstance.post<TopicDto>("/topics", createDto);
  return response.data;
}

export async function getAllTopics(classId: number): Promise<TopicDto[]> {
  const response = await axiosInstance.get<TopicDto[]>("/topics", {
    params: { classId },
  });
  return response.data;
}
