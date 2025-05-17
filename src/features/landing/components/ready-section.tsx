import AnimatedContent from "@/components/decoration/animate-content"
import { Button } from "@/components/ui/button"
import { useNavigate } from "@tanstack/react-router"
import { ArrowUpRight } from "lucide-react"
import { scrollToSection } from "../utils/functions"

export const ReadySection = () => {
    const navigate = useNavigate()

    return (
        <div
            id="ready-to-dive-in"
            className="w-full bg-muted py-8 sm:py-12 md:py-16 px-4 sm:px-6 flex flex-col items-center gap-4 sm:gap-6"
        >
            <AnimatedContent
                distance={50}
                delay={0.15}
                direction="vertical"
                reverse={false}
                transition={{ type: "spring", stiffness: 100, damping: 30 }}
                initialOpacity={0}
                animateOpacity
                threshold={0.2}
            >
                <div>
                    <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-2 sm:mb-4">
                        Ready to dive in?
                    </p>
                    <p className="text-sm sm:text-base md:text-lg font-bricolage text-center text-muted-foreground max-w-3xl mx-auto">
                        Start your scholarship journey with us today!
                    </p>
                </div>
            </AnimatedContent>

            <AnimatedContent
                distance={50}
                delay={200}
                direction="vertical"
                reverse={false}
                transition={{ type: "spring", stiffness: 100, damping: 30 }}
                initialOpacity={0}
                animateOpacity
                threshold={0.2}
            >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-2 sm:mt-4">
                    <Button variant="outline" onClick={() => scrollToSection("hero")} className="w-full sm:w-auto">
                        Go back to top
                    </Button>

                    <Button
                        onClick={() => navigate({ to: "/auth/register" })}
                        className="w-full sm:w-auto flex items-center gap-2"
                    >
                        Register Now
                        <ArrowUpRight className="size-4" />
                    </Button>
                </div>
            </AnimatedContent>
        </div>
    )
}
