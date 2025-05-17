import AnimatedContent from "@/components/decoration/animate-content"
import FadeContent from "@/components/decoration/fade-content"
import FlowingMenu from "@/components/decoration/flowing-menu"
import { CORE_VALUES } from "../utils/constant"

export const CoreValueSection = () => {
    return (
        <div
            id="principle-section"
            className="w-full flex flex-col gap-4 sm:gap-6 items-center py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-background"
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
                        Our Core Values
                    </p>
                    <p className="text-sm sm:text-base md:text-lg font-bricolage text-center text-muted-foreground max-w-3xl mx-auto px-2">
                        ScholarHub connects students to scholarship opportunities, community support, and the recognition they deserve.
                    </p>
                </div>
            </AnimatedContent>

            <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0} className="w-full mt-4 sm:mt-6">
                <div className="h-[300px] sm:h-[400px] md:h-[500px] relative w-full">
                    <FlowingMenu items={CORE_VALUES} />
                </div>
            </FadeContent>
        </div>
    )
}
