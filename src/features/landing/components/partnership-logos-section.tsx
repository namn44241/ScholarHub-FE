import AnimatedContent from "@/components/decoration/animate-content"
import FadeContent from "@/components/decoration/fade-content"
import { LogoCarousel } from "@/components/decoration/logo-carousel"
import { SendHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PARTNERSHIP_LOGOS } from "../utils/constant"

export const PartnershipLogos = () => {
    return (
        <div id="partnership-logo" className="w-full flex flex-col gap-4 sm:gap-6 items-center py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-background">
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
                <div className="container mx-auto">
                    <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-2 sm:mb-4">
                        Our University Partnerships
                    </p>
                </div>
            </AnimatedContent>

            <FadeContent
                blur={true}
                duration={1000}
                easing="ease-out"
                initialOpacity={0}
                className="container overflow-hidden"
            >
                <div className="w-full max-w-full flex items-center justify-center">
                    <LogoCarousel columnCount={5} logos={PARTNERSHIP_LOGOS} />
                </div>
            </FadeContent>

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
                <div className="mt-4 sm:mt-6">
                    <Button className="text-base sm:text-lg shadow-lg flex items-center gap-2">
                        Become one of us
                        <SendHorizontal className="size-4 sm:size-5 md:size-6" />
                    </Button>
                </div>
            </AnimatedContent>
        </div>
    )
}
