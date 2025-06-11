import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileMediaService, type IProfileMediaResponse } from "../services/profile-media-service";
import { personalKeys } from "./use-personal";

export const useUploadProfileMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      mediaType, 
      file 
    }: { 
      mediaType: "avatar" | "banner"; 
      file: File 
    }): Promise<IProfileMediaResponse> => {
      const validation = profileMediaService.validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      return profileMediaService.uploadProfileMedia(mediaType, file);
    },
    onSuccess: (data, variables) => {
      const mediaTypeVN = variables.mediaType === "avatar" ? "ảnh đại diện" : "ảnh bìa";
      toast.success(`Cập nhật ${mediaTypeVN} thành công!`);
      
      queryClient.invalidateQueries({ queryKey: personalKeys.all });
      queryClient.invalidateQueries({ queryKey: personalKeys.lists() });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Upload thất bại";
      toast.error(errorMessage);
      console.error("Upload profile media error:", error);
    },
  });
}; 