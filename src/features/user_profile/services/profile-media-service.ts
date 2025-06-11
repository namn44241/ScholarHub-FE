import { customFetch } from "@/lib/fetch";

export interface IProfileMediaResponse {
  message: string;
  file_path: string;
}

export const profileMediaService = {
  async uploadProfileMedia(
    mediaType: "avatar" | "banner", 
    file: File
  ): Promise<IProfileMediaResponse> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await customFetch<IProfileMediaResponse>(
        `/user/profile-media/${mediaType}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      return response;
    } catch (error) {
      console.error(`Upload ${mediaType} error:`, error);
      throw error;
    }
  },

  validateImageFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: "Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)" };
    }

    if (file.size > maxSize) {
      return { valid: false, error: "File quá lớn (tối đa 10MB)" };
    }

    return { valid: true };
  },
}; 