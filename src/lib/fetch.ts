import { BACKEND_API, REFREST_TOKEN_API } from "@/utils/endpoints";
import { authTokenManagement } from "./utils";

interface IFetchOptions extends RequestInit {
  skipAuth?: boolean;
  refreshOnUnauthorized?: boolean;
}

const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const { refresh_token } = authTokenManagement.getTokens();

    if (!refresh_token) {
      return false;
    }

    const response = await fetch(REFREST_TOKEN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token }),
    });

    if (!response.ok) {
      authTokenManagement.removeTokens();
      return false;
    }

    const data = await response.json();
    authTokenManagement.setTokens(data.access_token, data.refresh_token);
    return true;
  } catch (error) {
    console.error("Lỗi khi làm mới token:", error);
    authTokenManagement.removeTokens();
    return false;
  }
};

// custom fetch that auto pass token to header
export const customFetch = async <T = any>(
  url: string,
  options: IFetchOptions = {}
): Promise<T> => {
  const {
    skipAuth = false,
    refreshOnUnauthorized = true,
    ...IfetchOptions
  } = options;

  const fullUrl = url.startsWith("http") ? url : `${BACKEND_API}${url}`;

  const headers = new Headers(IfetchOptions.headers);

  // set default content type
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // set token to header
  if (!skipAuth) {
    const { access_token } = authTokenManagement.getTokens();
    if (access_token) {
      headers.set("Authorization", `Bearer ${access_token}`);
    }
  }

  const finalOptions: RequestInit = {
    ...IfetchOptions,
    headers,
  };

  try {
    let response = await fetch(fullUrl, finalOptions);

    if (response.status === 401 && refreshOnUnauthorized && !skipAuth) {
      const refreshSuccess = await refreshAccessToken();

      if (refreshSuccess) {
        // Retry the request with the new access token
        const { access_token } = authTokenManagement.getTokens();
        headers.set("Authorization", `Bearer ${access_token}`);

        finalOptions.headers = headers;
        response = await fetch(fullUrl, finalOptions);
      }
    }

    // Kiểm tra response có phải JSON không
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    const data = isJson ? await response.json() : await response.text();

    return data;
  } catch (error) {
    console.error("Lỗi trong quá trình fetch:", error);
    throw error;
  }
};

export const apiClient = {
  get: <T = any>(url: string, options?: IFetchOptions) =>
    customFetch<T>(url, {
      ...options,
      method: "GET",
    }),

  post: <T = any>(url: string, data?: any, options?: IFetchOptions) =>
    customFetch<T>(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = any>(url: string, data?: any, options?: IFetchOptions) =>
    customFetch<T>(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(url: string, data?: any, options?: IFetchOptions) =>
    customFetch<T>(url, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(url: string, data?: any, options?: IFetchOptions) =>
    customFetch<T>(url, {
      ...options,
      method: "DELETE",
      body: data ? JSON.stringify(data) : undefined,
    }),
};
