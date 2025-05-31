import type { IUserProfile } from "../utils/types";

export interface IProfileResponse {
  success: boolean;
  message: string;
  payload: {
    profile: IUserProfile;
  };
}
