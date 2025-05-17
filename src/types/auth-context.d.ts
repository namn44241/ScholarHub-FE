import { ReactNode } from "react";
import type { IUser } from "./User";
import type { IUserResponse } from "@/services/auth-service";

export interface IAuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  checkCurrentUser: (userId: string) => boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: IUser; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  getCurrentUser: () => Promise<IUserResponse>;
  error: string | null;
  clearError: () => void;
}

export interface IAuthProviderProps {
  children: ReactNode;
}