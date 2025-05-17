import { apiClient, customFetch } from "@/lib/fetch";
import { authTokenManagement } from "@/lib/utils";
import type { IUser } from "@/types/user";
import { GET_USER_API, LOGIN_API, REGISTER_API } from "@/utils/endpoints";

export interface ILoginResponse {
  success: boolean;
  message: string;
  payload: {
    access_token: string;
    refresh_token: string;
    token_type: string;
  };
}

export interface IRegisterResponse {
  success: boolean;
  message: string;
  payload: {
    user: IUser | null;
  };
}

export interface IRefreshTokenResponse {
  success: boolean;
  message: string;
  payload: {
    access_token: string;
    refresh_token: string;
    token_type: string;
  };
}

export interface IUserResponse {
  success: boolean;
  message: string;
  payload: {
    user: IUser;
  };
}

export interface IAuthCheckResponse {
  success: boolean;
  payload: {
    isAuthenticated: boolean;
    user: IUser | null;
  };
}

export interface ILogoutResponse {
  success: boolean;
}

export const authService = {
  checkAuth: async (): Promise<IAuthCheckResponse> => {
    const { access_token } = authTokenManagement.getTokens();

    if (!access_token) {
      return {
        success: false,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      };
    }

    try {
      const response = await apiClient.get<IUserResponse>(REGISTER_API);

      return {
        success: true,
        payload: {
          isAuthenticated: true,
          user: response.payload.user,
        },
      };
    } catch (error) {
      return {
        success: false,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      };
    }
  },

  login: async (
    username: string,
    password: string
  ): Promise<ILoginResponse> => {
    // For FormData requests, we need to create a FormData object
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    // Use apiClient with FormData options
    const response = await customFetch(LOGIN_API, {
      method: "POST",
      body: formData,
      headers: {
        // Remove Content-Type so browser can set it with boundary
      },
      skipAuth: true, // Login doesn't need existing auth token
    });

    const { access_token, refresh_token } = response.payload;
    authTokenManagement.setTokens(access_token, refresh_token);

    return response;
  },

  register: async (userData: {
    email: string;
    password: string;
    full_name?: string;
  }): Promise<IRegisterResponse> => {
    const response = await apiClient.post<IRegisterResponse>(
      REGISTER_API,
      userData
    );
    return response;
  },

  getCurrentUser: async (): Promise<IUserResponse> => {
    const response = await apiClient.get<IUserResponse>(GET_USER_API);
    return response;
  },

  logout: (): ILogoutResponse => {
    authTokenManagement.removeTokens();
    return {
      success: true,
    };
  },
};
