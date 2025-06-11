import { apiClient } from "@/lib/fetch";

export interface IProfileStats {
  followers_count: number;
  following_count: number;
  posts_count?: number;
}

export const profileStatsService = {
  async getProfileStats(userId: string): Promise<IProfileStats> {
    const response = await apiClient.get(`/user/profile/${userId}/stats`);
    if (!response.success) {
      throw new Error(response.message || "Không thể tải thống kê profile");
    }
    return response.payload;
  },
}; 