import { apiClient } from "@/lib/fetch";
import { endpoints } from "./endpoints";
import type { IDocument } from "../utils/types";

export interface DocumentCreateRequest {
  type: "resume" | "cover_letter" | "other";
  file_path: string;
  file_name?: string;
}

export interface DocumentUpdateRequest {
  id: string;
  type?: "resume" | "cover_letter" | "other";
  file_path?: string;
  file_name?: string;
}

export interface DocumentResponse {
  success: boolean;
  message: string;
  payload?: {
    document?: IDocument;
    documents?: IDocument[];
  };
}

export const documentService = {
  // Lấy danh sách documents
  getDocuments: async (): Promise<DocumentResponse> => {
    return apiClient.get(endpoints.profile.documents.get);
  },

  // Tạo document mới  
  createDocument: async (data: DocumentCreateRequest): Promise<DocumentResponse> => {
    return apiClient.post(endpoints.profile.documents.create, data);
  },

  // Cập nhật document
  updateDocument: async (data: DocumentUpdateRequest): Promise<DocumentResponse> => {
    return apiClient.put(endpoints.profile.documents.update, data);
  },

  // Xóa document
  deleteDocument: async (id: string): Promise<DocumentResponse> => {
    return apiClient.delete(endpoints.profile.documents.delete, { id });
  },
};