import { authService } from "@/services/auth-service";
import type { IAuthContextType, IAuthProviderProps } from "@/types/auth-context";
import type { IUser } from "@/types/user";
import { getErrorMessage } from "@/utils/functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

const STORAGE_KEYS = {
  USER: 'app_user',
};

const AuthContext = createContext<IAuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const clearError = () => setError(null);

  const saveUserData = (userData: IUser | null) => {
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

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            queryClient.setQueryData(authKeys.user(), parsedUser);
            queryClient.setQueryData(authKeys.session(), {
              isAuthenticated: true,
              user: parsedUser,
            });

            const result = await authService.checkAuth();
            if (!result.success || !result.payload.isAuthenticated) {
              authService.logout();
              saveUserData(null);
            }
          } catch (parseError) {
            authService.logout();
            saveUserData(null);
          }
        } else {
          saveUserData(null);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (parseError) {
            saveUserData(null);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [queryClient]);

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      authService.login(credentials.email, credentials.password),
    onSuccess: async () => {
      setError(null);
      toast.success("Login successful");
      return { success: true };
    },
    onError: (err: any) => {
      setError(getErrorMessage(err) || "Login failed");
      toast.error(getErrorMessage(err) || "Login failed");
      authService.logout();
      saveUserData(null);
      return { success: false, error: getErrorMessage(err) };
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: { email: string; password: string; full_name?: string }) =>
      authService.register(userData),
    onSuccess: () => {
      setError(null);
      toast.success("Registration successful! Please log in.");
      // Navigation will be handled by the component using this mutation's result
      return { success: true };
    },
    onError: (err: any) => {
      setError(getErrorMessage(err) || "Registration failed");
      toast.error(getErrorMessage(err) || "Registration failed");
      return { success: false, error: getErrorMessage(err) };
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return authService.logout();
    },
    onSuccess: () => {
      saveUserData(null);
      toast.success("Logged out successfully");
      queryClient.clear();
      setError(null);
      // Navigation will be handled by the component using this mutation's result
      return { success: true };
    },
    onError: (err: any) => {
      setError(getErrorMessage(err) || "Logout failed");
      toast.error(getErrorMessage(err) || "Logout failed");
      saveUserData(null);
      return { success: false, error: getErrorMessage(err) };
    },
  });

  const getCurrentUserMutation = useMutation({
    mutationFn: async () => {
      return await authService.getCurrentUser();
    },
    onSuccess: (response) => {
      if (response.success) {
        saveUserData(response.payload.user);
        return { response};
      }
      return { success: false, error: "Failed to get user data" };
    },
    onError: (err: any) => {
      setError(getErrorMessage(err) || "Failed to get user data");
      toast.error(getErrorMessage(err) || "Failed to get user data");
      return { success: false, error: getErrorMessage(err) };
    },
  });

  const login = async (email: string, password: string) => {
    return await loginMutation.mutateAsync({ email, password });
  };

  const register = async (email: string, password: string) => {
    return await registerMutation.mutateAsync({
      email,
      password,
    });
  };

  const logout = async () => {
    return await logoutMutation.mutateAsync();
  };

  const getCurrentUser = async () => {
    return await getCurrentUserMutation.mutateAsync()
  };

  const checkCurrentUser = (userId: string): boolean => {
    return user?.id === userId;
  };

  const value: IAuthContextType = {
    user,
    isAuthenticated: !!user,
    checkCurrentUser,
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending || getCurrentUserMutation.isPending,
    login,
    logout,
    register,
    getCurrentUser,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};