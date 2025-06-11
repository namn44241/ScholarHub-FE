import { useQuery } from "@tanstack/react-query";
import { communityService } from "@/features/community/services/community";
import { STALE_TIME, GC_TIME } from "@/utils/constants";

export const useGetFollowersList = (userId: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["followers", userId],
    queryFn: () => communityService.getFollowersList(userId),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: enabled && !!userId,
  });
};

export const useGetFollowingList = (userId: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["following", userId],
    queryFn: () => communityService.getFollowingList(userId),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: enabled && !!userId,
  });
}; 