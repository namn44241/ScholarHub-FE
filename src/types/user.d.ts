import type { AUTH_PROVIDER } from "@/utils/constants";

export interface IUser {
    id: string;
    email: string;
    auth_provider: AUTH_PROVIDER;
    role: string;
    avatar?: string;
    banner?: string;
    created_at?: string;
}
