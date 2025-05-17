

import AnimatedContent from "@/components/decoration/animate-content"
import FadeContent from "@/components/decoration/fade-content"
import { LazyLoadImage } from "react-lazy-load-image-component"

export const BecomeMentorSection = () => {
    return (
        <div id="become-mentor" className="w-full bg-muted py-8 sm:py-12 md:py-16">
            <div className="container-wrapper">
                <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12 container">
                    {/* Text Content */}
                    <AnimatedContent
                        distance={50}
                        delay={0.15}
                        direction="horizontal"
                        reverse={false}
                        transition={{ type: "spring", stiffness: 100, damping: 30 }}
                        initialOpacity={0}
                        animateOpacity
                        threshold={0.2}
                    >
                        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-2 sm:mb-4">
                            Turn Your Experience Into Opportunity
                        </p>
                        <p className="text-sm sm:text-base md:text-lg font-bricolage text-muted-foreground">
                            Become a ScholarHub mentor, provide personalized guidance and exclusive resources, and earn while
                            helping students achieve their academic goals.
                        </p>
                    </AnimatedContent>

                    <FadeContent
                        blur={true}
                        duration={1000}
                        easing="ease-out"
                        initialOpacity={0}
                        className="w-full lg:w-1/2 mt-4 sm:mt-6 lg:mt-0"
                    >
                        <LazyLoadImage
                            src={"/placeholder.svg"}
                            alt={"Illustration for mentor section"}
                            className="w-full h-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale aspect-video"
                        />
                    </FadeContent>
                </div>
            </div>
        </div>
    )
}


