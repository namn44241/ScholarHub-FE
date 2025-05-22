import { apiClient } from "@/lib/fetch";
import type { IMatchingEvaluate } from "../utils/types";
import { SCHOLARSHIP_MATCHING_ENDPOINT } from "./endpoints";

export interface IScholarshipMatchingResponse {
  success: boolean;
  message?: string;
  payload: {
    evaluate: IMatchingEvaluate;
  };
}

export interface IScholarshipMatchingDTO {
  id: string;
}

export const scholarshipMatchingService = {
  postScholarshipMatching: async (
    payload: IScholarshipMatchingDTO
  ): Promise<IScholarshipMatchingResponse> => {
    const response = await apiClient.post(
      `${SCHOLARSHIP_MATCHING_ENDPOINT.DEFAULT}?id=${payload.id}`
    );
    return response as IScholarshipMatchingResponse;
  },
};
