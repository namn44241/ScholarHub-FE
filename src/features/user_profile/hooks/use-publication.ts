import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  publicationService,
  type IPublicationDTO,
} from "../services/publication-service";
import type { IPublication } from "../utils/types";

export const publicationKeys = {
  all: ["publication"] as const,
  lists: () => [...publicationKeys.all, "list"] as const,
  list: () => [...publicationKeys.lists(), "list"] as const,
  details: () => [...publicationKeys.all, "detail"] as const,
  detail: (id: string) => [...publicationKeys.details(), id] as const,
};

export const useGetPublication = () => {
  return useQuery({
    queryKey: publicationKeys.list(),
    queryFn: async () => {
      const response = await publicationService.getPublication();
      return response.payload.publication || [];
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const usePostPublication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IPublicationDTO) =>
      publicationService.postPublication(data),
    onSuccess: (newPublication) => {
      // Update the cache with the new publication data
      queryClient.setQueryData(
        publicationKeys.detail(
          Array.isArray(newPublication.payload.publication)
            ? newPublication.payload.publication[0]?.id || ""
            : newPublication.payload.publication.id || ""
        ),
        newPublication
      );

      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: publicationKeys.lists(),
      });
    },
  });
};

export const usePutPublication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IPublication) => publicationService.putPublication(data),
    onSuccess: (newPublication) => {
      // Update the cache with the new publication data
      queryClient.setQueryData(
        publicationKeys.detail(
          Array.isArray(newPublication.payload.publication)
            ? newPublication.payload.publication[0]?.id || ""
            : newPublication.payload.publication.id || ""
        ),
        newPublication
      );

      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: publicationKeys.lists(),
      });
    },
  });
};

export const useDeletePublication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => publicationService.deletePublication(id),
    onSuccess: () => {
      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: publicationKeys.lists(),
      });
    },
  });
};
