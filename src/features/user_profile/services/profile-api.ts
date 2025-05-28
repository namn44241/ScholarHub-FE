import { apiClient } from "@/lib/fetch";
import type { IUserProfile } from "../utils/types";

export interface IProfileResponse {
  success: boolean;
  message: string;
  payload: {
    profile: IUserProfile;
  };
}

export const profileApi = {
  getCurrentUserProfile: async (): Promise<IProfileResponse> => {
    const response = await apiClient.get<IProfileResponse>("/user/me");
    return response;
  },
}; 