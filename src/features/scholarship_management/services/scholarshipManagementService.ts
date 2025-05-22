import { apiClient } from "@/lib/fetch";
import type { IScholarship } from "@/types/scholarship";
import { SCHOLARSHIP_MANAGE_ENDPOINTS } from "./endpoints";

export interface IGetScholarshipsResponse {
  success: boolean;
  message: string;
  payload: {
    scholarships: IScholarship[];
  };
}

export interface IPostScholarshipResponse {
  success: boolean;
  message: string;
  payload: {
    scholarship: IScholarship;
  };
}

export interface IScholarshipQueryParams {
  limit?: number;
  offset?: number;
}

export interface IPostScholarshipDTO extends Omit<IScholarship, "id"> {}

export const scholarshipService = {
  getScholarships: async (
    params: IScholarshipQueryParams
  ): Promise<IGetScholarshipsResponse> => {
    const response = await apiClient.get(
      `${SCHOLARSHIP_MANAGE_ENDPOINTS.GET_SCHOLARSHIPS}?limit=${params.limit}&offset=${params.offset}`
    );
    return response.data as IGetScholarshipsResponse;
  },

  postScolarship: async (
    payload: IPostScholarshipDTO
  ): Promise<IPostScholarshipResponse> => {
    const response = await apiClient.post(
      SCHOLARSHIP_MANAGE_ENDPOINTS.POST_SCHOLARSHIP,
      payload
    );
    return response.data as IPostScholarshipResponse;
  },
};
