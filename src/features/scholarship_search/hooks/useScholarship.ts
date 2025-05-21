import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { scholarshipSearchServices } from "../services/scholarshipSearchServices";

export const scholarshipSearchKeys = {
  all: ["scholarshipSearch"] as const,
  lists: () => [...scholarshipSearchKeys.all, "list"] as const,
  list: (filters: any) =>
    [
      ...scholarshipSearchKeys.lists(),
      {
        ...filters,
      },
    ] as const,
  details: () => [...scholarshipSearchKeys.all, "detail"] as const,
  detail: (id: string) => [...scholarshipSearchKeys.details(), id] as const,
};

export const useSearchScholarships = (query: string) => {
  return useQuery({
    queryKey: scholarshipSearchKeys.list({ query }),
    queryFn: async () => {
      const response = await scholarshipSearchServices.searchScholarships(
        query
      );
      return response.payload.scholarships;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!query,
  });
};

export const useRecommendScholarships = (params: {
  suggest: boolean;
  limit: number;
  offset: number;
}) => {
  return useQuery({
    queryKey: scholarshipSearchKeys.list(params),
    queryFn: async () => {
      const response = await scholarshipSearchServices.getScholarshipRecommend(
        params
      );
      return response.payload.scholarships;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const useForceRecreateScholarshipRecommend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      scholarshipSearchServices.forceRecreateScholarshipRecommend(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scholarshipSearchKeys.lists(),
      });
      toast.success("Scholarship recommendations recreated successfully");
    },
  });
};
