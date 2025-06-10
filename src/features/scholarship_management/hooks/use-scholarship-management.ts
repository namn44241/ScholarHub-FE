import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  scholarshipService,
  type IPostScholarshipDTO,
  type IScholarshipQueryParams,
} from "../services/scholarship-management";

export const scholarshipKeys = {
  all: ["scholarshipsManagement"] as const,
  lists: () => [...scholarshipKeys.all, "list"] as const,
  list: (filters: IScholarshipQueryParams) =>
    [
      ...scholarshipKeys.lists(),
      {
        limit: filters.limit,
        offset: filters.offset,
      },
    ] as const,
  details: () => [...scholarshipKeys.all, "detail"] as const,
  detail: (id: string) => [...scholarshipKeys.details(), id] as const,
};

export const useGetScholarships = (params: IScholarshipQueryParams) => {
  const { limit = 10, offset = 0 } = params;

  return useQuery({
    queryKey: scholarshipKeys.list(params),
    queryFn: async () => {
      const response = await scholarshipService.getScholarships({
        limit,
        offset,
      });
      return response.payload.scholarships;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const usePostScholarship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IPostScholarshipDTO) =>
      scholarshipService.postScolarship(data),
    onSuccess: (newScholarship) => {
      // Update the cache with the new scholarship data
      queryClient.setQueryData(
        scholarshipKeys.detail(newScholarship.payload.scholarship.id),
        newScholarship
      );

      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: scholarshipKeys.lists(),
      });
    },
  });
};

export const useDeleteScholarship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scholarshipId: string) =>
      scholarshipService.deleteScholarship(scholarshipId),
    onSuccess: (_response, scholarshipId) => {
      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: scholarshipKeys.lists(),
      });

      // Optionally, remove the specific scholarship from the cache
      queryClient.removeQueries({
        queryKey: scholarshipKeys.detail(scholarshipId),
      });
    },
  });
};
