import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  scholarshipMatchingService,
  type IScholarshipMatchingDTO,
  type IScholarshipMatchingResponse,
} from "../services/scholarship-matching";

export const scholarshipMatchingKeys = {
  all: ["scholarship-matching"] as const,
  detail: (id: string) => [...scholarshipMatchingKeys.all, id] as const,
};

export const usePostScholarshipMatching = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IScholarshipMatchingDTO) =>
      scholarshipMatchingService.postScholarshipMatching(data),
    onSuccess: (response: IScholarshipMatchingResponse, variables) => {
      queryClient.setQueryData(
        scholarshipMatchingKeys.detail(variables.id),
        response.payload.evaluate
      );

      queryClient.invalidateQueries({
        queryKey: scholarshipMatchingKeys.all,
      });
    },
    onError: (error) => {
      console.error("Error fetching scholarship matching:", error);
    },
  });
};
