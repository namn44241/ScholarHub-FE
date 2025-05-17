import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth-service";
import type { IUser } from "@/types/user";
import { getErrorMessage } from "@/utils/functions";
import { toast } from "sonner";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

const STORAGE_KEYS = {
  USER: "app_user",
};

const saveUserData = (
  userData: IUser | null,
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>,
  queryClient: ReturnType<typeof useQueryClient>
) => {
  if (userData) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  setUser(userData);
  queryClient.setQueryData(authKeys.user(), userData);
  queryClient.setQueryData(authKeys.session(), {
    isAuthenticated: !!userData,
    user: userData,
  });
};

export const useGetCurrentUser = (
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>
) => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const response = await authService.getCurrentUser();
      if (response.success) {
        const userData = response.payload.user;
        saveUserData(userData, setUser, queryClient);
        return userData;
      }
      throw new Error("Failed to get user data");
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const useLogin = (
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      authService.login(credentials.email, credentials.password),
    onSuccess: async () => {
      setError(null);
      try {
        const userResponse = await authService.getCurrentUser();
        if (userResponse.success) {
          saveUserData(userResponse.payload.user, setUser, queryClient);
        }
      } catch (err) {
        console.error("Error fetching user data after login:", err);
      }
      toast.success("Login successful");
      return { success: true };
    },
    onError: (err: any) => {
      setError(getErrorMessage(err) || "Login failed");
      toast.error(getErrorMessage(err) || "Login failed");
      authService.logout();
      saveUserData(null, setUser, queryClient);
      return { success: false, error: getErrorMessage(err) };
    },
  });
};

export const useRegister = (
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  return useMutation({
    mutationFn: (userData: {
      email: string;
      password: string;
      full_name?: string;
    }) => authService.register(userData),
    onSuccess: () => {
      setError(null);
      toast.success("Registration successful! Please log in.");
      return { success: true };
    },
    onError: (err: any) => {
      setError(getErrorMessage(err) || "Registration failed");
      toast.error(getErrorMessage(err) || "Registration failed");
      return { success: false, error: getErrorMessage(err) };
    },
  });
};

export const useLogout = (
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      return authService.logout();
    },
    onSuccess: () => {
      saveUserData(null, setUser, queryClient);
      toast.success("Logged out successfully");
      queryClient.clear();
      setError(null);
      return { success: true };
    },
    onError: (err: any) => {
      setError(getErrorMessage(err) || "Logout failed");
      toast.error(getErrorMessage(err) || "Logout failed");
      saveUserData(null, setUser, queryClient);
      return { success: false, error: getErrorMessage(err) };
    },
  });
};

export const useAuthStatus = () => {
  const queryClient = useQueryClient();
  const session = queryClient.getQueryData<{
    isAuthenticated: boolean;
    user: IUser | null;
  }>(authKeys.session());
  
  return {
    isAuthenticated: !!session?.isAuthenticated,
    user: session?.user || null,
  };
};