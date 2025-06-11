import { apiClient } from "@/lib/fetch";
import { USER_PROFILE_ENDPOINTS } from "./endpoints";

export interface IProfileStats {
  followers_count: number;
  following_count: number;
  posts_count?: number;
}

export const profileStatsService = {
  async getProfileStats(userId: string): Promise<IProfileStats> {
    const response = await apiClient.get(USER_PROFILE_ENDPOINTS.PROFILE_STATS(userId));
    if (!response.success) {
      throw new Error(response.message || "Không thể tải thống kê profile");
    }
    return response.payload;
  },
}; 