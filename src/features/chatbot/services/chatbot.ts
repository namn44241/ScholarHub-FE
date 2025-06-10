import { apiClient } from "@/lib/fetch";
import { toast } from "sonner";
import type { IMessage, IThread } from "../utils/types";
import { CHAT_BOT_MANAGE_ENDPOINTS } from "./endpoints";

export interface IThreadDTO {
  user_id: string;
  limit?: number;
}

export interface IChatDTO {
  question?: string;
  user_id: string;
  thread_id: string;
  limit?: number;
  offset?: number;
}

export interface IThreadResponse {
  success: boolean;
  payload: {
    thread_id?: string; // for new thread api
    threads?: IThread[]; // for threads list api
  };
}

export interface IChatResponse {
  success: boolean;
  payload: {
    messages?: IMessage[]; // for get chat api
    answer?: string; // for post chat api
    thread_id?: string; // for post chat api
  };
}

export const chatbotService = {
  getChat: async ({
    user_id,
    thread_id,
  }: {
    user_id: string;
    thread_id: string;
  }): Promise<IChatResponse> => {
    const response = await apiClient.get(
      `${CHAT_BOT_MANAGE_ENDPOINTS.GET_CHAT}/${user_id}/${thread_id}`
    );
    if (!response.success) {
      toast.error("Failed to fetch chat messages");
    }
    return response as IChatResponse;
  },

  postChat: async ({
    question,
    user_id,
    thread_id,
    limit,
    offset,
  }: IChatDTO): Promise<IChatResponse> => {
    const response = await apiClient.post(CHAT_BOT_MANAGE_ENDPOINTS.POST_CHAT, {
      question,
      user_id,
      thread_id,
      limit,
      offset,
    });
    return response as IChatResponse;
  },

  newThread: async ({
    user_id,
    limit,
  }: IThreadDTO): Promise<IThreadResponse> => {
    const response = await apiClient.post(
      CHAT_BOT_MANAGE_ENDPOINTS.NEW_THREAD,
      {
        user_id,
        limit,
      }
    );
    if (!response.success) {
      toast.error("Failed to create new thread");
    }
    return response as IThreadResponse;
  },

  deleteThread: async ({
    thread_id,
  }: {
    thread_id: string;
  }): Promise<IThreadResponse> => {
    const response = await apiClient.delete(
      `${CHAT_BOT_MANAGE_ENDPOINTS.DELETE_THREAD}?thread_id=${thread_id}`
    );
    return response as IThreadResponse;
  },

  threadsList: async (limit?: number): Promise<IThreadResponse> => {
    const response = await apiClient.get(
      `${CHAT_BOT_MANAGE_ENDPOINTS.THREADS_LIST}?limit=${limit || 10}`
    );
    if (!response.success) {
      toast.error("Failed to fetch threads");
    }
    return response as IThreadResponse;
  },
};
