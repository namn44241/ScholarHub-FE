import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  referenceService,
  type IReferenceDTO,
} from "../services/references-service";
import type { IReference } from "../utils/types";

export const referenceKeys = {
  all: ["reference"] as const,
  lists: () => [...referenceKeys.all, "list"] as const,
  list: () => [...referenceKeys.lists(), "list"] as const,
  details: () => [...referenceKeys.all, "detail"] as const,
  detail: (id: string) => [...referenceKeys.details(), id] as const,
};

export const useGetReference = () => {
  return useQuery({
    queryKey: referenceKeys.list(),
    queryFn: async () => {
      const response = await referenceService.getReference();
      return response.payload.reference || [];
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const usePostReference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IReferenceDTO) => referenceService.postReference(data),
    onSuccess: (newReference) => {
      // Update the cache with the new reference data
      queryClient.setQueryData(
        referenceKeys.detail(
          Array.isArray(newReference.payload.reference)
            ? newReference.payload.reference[0]?.id || ""
            : newReference.payload.reference.id || ""
        ),
        newReference
      );

      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: referenceKeys.lists(),
      });
    },
  });
};

export const usePutReference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IReference) => referenceService.putReference(data),
    onSuccess: (newReference) => {
      // Update the cache with the new reference data
      queryClient.setQueryData(
        referenceKeys.detail(
          Array.isArray(newReference.payload.reference)
            ? newReference.payload.reference[0]?.id || ""
            : newReference.payload.reference.id || ""
        ),
        newReference
      );

      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: referenceKeys.lists(),
      });
    },
  });
};

export const useDeleteReference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => referenceService.deleteReference(id),
    onSuccess: () => {
      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: referenceKeys.lists(),
      });
    },
  });
};
