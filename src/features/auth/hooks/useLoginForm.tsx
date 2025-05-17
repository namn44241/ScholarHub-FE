import { useAuth } from "@/contexts/auth-context";
import type { IUser } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 6 characters long")
        .max(100, "Password cannot exceed 100 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export type LoginFormValues = z.infer<typeof formSchema>;

export const useLoginForm = () => {
    const { login, getCurrentUser, isLoading } = useAuth();
    const navigate = useNavigate();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onLogin = async (data: LoginFormValues) => {
        try {
            await login(data.email, data.password);
            const response = await getCurrentUser() as IUser;
            if (response) {
                navigate({
                    to: "/profile/$userId",
                    
                    params: { userId: response.id || "" },
                })
            } else {
                form.setError("email", { message: response });
            }
        } catch (error) {
            form.setError("email", { message: "Invalid email or password" });
        }
    }

    return {
        form,
        onLogin,
        isLoading,
    };
}