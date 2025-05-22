import { apiClient } from "@/lib/fetch";
import type { IScholarship } from "@/types/scholarship";
import { SCHOLARSHIP_RECOMMEND_ENDPOINTS } from "./endpoints";

export interface ISearchScholarshipResponse {
  success: boolean;
  message: string;
  payload: {
    scholarships: IScholarship[];
  };
}

export interface IScholarshipRecommendResponse {
  success: boolean;
  message: string;
  payload: {
    scholarships: IScholarship[];
  };
}

export interface IScholarshipDetailResponse {
  success: boolean;
  message?: string;
  payload: {
    scholarships: IScholarship;
  };
}

export interface IPostScholarshipDTO extends Omit<IScholarship, "id"> {}

export interface IScholarshipDetailDTO {
  id: string;
}

export interface IGetScholarshipRecommendParams {
  suggest: boolean;
  limit: number;
  offset: number;
}

export const scholarshipSearchServices = {
  searchScholarships: async (
    query?: string
  ): Promise<ISearchScholarshipResponse> => {
    const response = await apiClient.get(
      `${SCHOLARSHIP_RECOMMEND_ENDPOINTS.SEARCH_SCHOLARSHIPS}?query=${query}`
    );
    return response as ISearchScholarshipResponse;
  },

  getScholarshipRecommend: async (
    params: IGetScholarshipRecommendParams
  ): Promise<IScholarshipRecommendResponse> => {
    const response = await apiClient.get(
      `${SCHOLARSHIP_RECOMMEND_ENDPOINTS.DEFAULT}?suggest=${params.suggest}&limit=${params.limit}&offset=${params.offset}`
    );
    return response as IScholarshipRecommendResponse;
  },

  forceRecreateScholarshipRecommend:
    async (): Promise<IScholarshipRecommendResponse> => {
      const response = await apiClient.put(
        SCHOLARSHIP_RECOMMEND_ENDPOINTS.FORCE_RECREATE
      );
      return response as IScholarshipRecommendResponse;
    },

  getScholarshipDetail: async (
    payload: IScholarshipDetailDTO
  ): Promise<IScholarshipDetailResponse> => {
    const response = await apiClient.get(
      `${SCHOLARSHIP_RECOMMEND_ENDPOINTS.DEFAULT}?id=${payload.id}`
    );
    return response as IScholarshipDetailResponse;
  },
};
