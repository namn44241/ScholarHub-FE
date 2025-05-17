import { Link } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"

import ScholarHubLogo from "@/components/common/scholarhub-logo"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useLoginForm } from "../hooks/useLoginForm"

export const LoginForm = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) => {
    const { form, onLogin, isLoading } = useLoginForm();

    return (
        <div className={cn("flex flex-col items-center gap-6 w-full", className)} {...props}>
            <div className="flex flex-col items-center gap-2">
                <Link
                    to="/"
                >
                    <ScholarHubLogo className="text-4xl" />
                </Link>
                <p className="text-xl font-bold">Login to your account</p>
                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/auth/register" className="underline underline-offset-4">
                        Create an account
                    </Link>
                </p>
            </div>


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onLogin)} className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="email@example.com"
                                            type="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder=""
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Login...
                            </>
                        ) :
                            "Login"}
                    </Button>
                </form>
            </Form>

            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking login, you agree to our <Link to="/term-of-service">Terms of Service</Link>{" "}
                and <Link to="/privacy-policy">Privacy Policy</Link>.
            </div>
        </div>
    )
}
