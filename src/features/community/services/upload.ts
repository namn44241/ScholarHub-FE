import { customFetch } from "@/lib/fetch";
import { COMMUNITY_ENDPOINTS } from "./endpoints";

export interface IUploadResponse {
  success: boolean;
  message: string;
  payload: {
    file_url: string;
    file_name: string;
    file_type: string;
    content_type: string;
    size: number;
  };
}

export interface IMultipleUploadResponse {
  success: boolean;
  message: string;
  payload: {
    files: IUploadResponse["payload"][];
  };
}

export const uploadService = {
  async uploadFile(formData: FormData): Promise<IUploadResponse> {
    try {
      const response = await customFetch<IUploadResponse>(
        COMMUNITY_ENDPOINTS.UPLOAD_FILE,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format");
      }

      if (!response.success) {
        throw new Error(response.message || "Upload failed");
      }

      if (!response.payload || !response.payload.file_url) {
        throw new Error("Invalid response: missing file_url");
      }

      return response;
    } catch (error) {
      console.error("Upload service error:", error);
      throw error;
    }
  },

  async uploadMultipleFiles(files: File[]): Promise<IMultipleUploadResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await customFetch<IMultipleUploadResponse>(
        COMMUNITY_ENDPOINTS.UPLOAD_MULTIPLE_FILES,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format");
      }

      if (!response.success) {
        throw new Error(response.message || "Upload failed");
      }

      return response;
    } catch (error) {
      console.error("Multiple upload service error:", error);
      throw error;
    }
  },

  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSizes = {
      image: 10 * 1024 * 1024, // 10MB
      video: 100 * 1024 * 1024, // 100MB
      file: 25 * 1024 * 1024, // 25MB
    };

    const allowedTypes = {
      image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      video: ["video/mp4", "video/webm", "video/mov", "video/avi"],
      file: [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    };

    let category: keyof typeof allowedTypes | null = null;
    for (const [cat, types] of Object.entries(allowedTypes)) {
      if (types.includes(file.type)) {
        category = cat as keyof typeof allowedTypes;
        break;
      }
    }

    if (!category) {
      return { valid: false, error: `File type ${file.type} not allowed` };
    }

    if (file.size > maxSizes[category]) {
      const maxSizeMB = maxSizes[category] / (1024 * 1024);
      return {
        valid: false,
        error: `File too large (max ${maxSizeMB}MB for ${category}s)`,
      };
    }

    return { valid: true };
  },
};
