import { useAuthStatus, useGetCurrentUser, useLogin, useLogout, useRegister } from "@/hooks/use-auth-mutations";
import type { IAuthContextType, IAuthProviderProps } from "@/types/auth-context";
import type { IUser } from "@/types/user";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

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
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false); // For login/register/logout
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated } = useAuthStatus();
  const getCurrentUserQuery = useGetCurrentUser(setUser);
  const loginMutation = useLogin(setUser, setError);
  const registerMutation = useRegister(setError);
  const logoutMutation = useLogout(setUser, setError);

  // Handle initial user fetch
  useEffect(() => {
    const fetchUser = async () => {
      await getCurrentUserQuery.refetch();
      fetchUser();
    }
    }, []);

  // Handle loading for auth mutations
  useEffect(() => {
    setIsAuthLoading(
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending
    );
  }, [
    loginMutation.isPending,
    registerMutation.isPending,
    logoutMutation.isPending,
  ]);

  const clearError = () => setError(null);

  const login = async (email: string, password: string) => {
    return await loginMutation.mutateAsync({ email, password });
  };

  const register = async (email: string, password: string, full_name?: string) => {
    return await registerMutation.mutateAsync({ email, password, full_name });
  };

  const logout = async () => {
    return await logoutMutation.mutateAsync();
  };

  const getCurrentUser = async () => {
    return await getCurrentUserQuery.refetch();
  };

  const checkCurrentUser = (userId: string): boolean => {
    return user?.id === userId;
  };

  const value: IAuthContextType = {
    user,
    isAuthenticated,
    checkCurrentUser,
    isLoading: isAuthLoading, // Only show loading for auth mutations
    login,
    logout,
    register,
    getCurrentUser,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};