import { apiClient } from "./apiClient";
import { DrawnCard, Language, Topic, TopicEvent, PlanQuota, TopicWithUsage } from "../types";

export interface TopicDetailResponse {
  topic: Topic;
  events: TopicEvent[];
  quota?: PlanQuota | null;
  event_usage?: { used: number; remaining: number | null };
}

export interface TopicsListResponse {
  topics: TopicWithUsage[];
  quota?: PlanQuota | null;
}

export const listTopics = async (): Promise<TopicsListResponse> => {
  return apiClient.get("/api/topics");
};

export const createTopic = async (params: {
  title: string;
  language: Language;
  baseline_cards?: DrawnCard[] | null;
  baseline_reading?: string | null;
}): Promise<{ topic: Topic; quota?: PlanQuota | null }> => {
  return apiClient.post("/api/topics", params);
};

export const getTopicDetail = async (id: string): Promise<TopicDetailResponse> => {
  return apiClient.get(`/api/topics/${id}`);
};

export const addTopicEvent = async (id: string, params: {
  name: string;
  cards?: DrawnCard[] | null;
  reading?: string | null;
}): Promise<{
  event: TopicEvent;
  event_usage?: { used: number; remaining: number | null };
  quota?: PlanQuota | null;
}> => {
  return apiClient.post(`/api/topics/${id}/events`, params);
};
