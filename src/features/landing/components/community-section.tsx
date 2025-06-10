import AnimatedContent from "@/components/decoration/animate-content"
import FadeContent from "@/components/decoration/fade-content"
import { LazyLoadImage } from "react-lazy-load-image-component"
import communityImg from "@/assets/images/landing/community_image.png"
import communityImgDark from "@/assets/images/landing/community_image_dark.png"

export const CommunitySection = () => {
    return (
        <div id="community" className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 flex flex-col items-center gap-4 sm:gap-6 bg-background w-full">
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
                        Join Our Scholarship Community
                    </p>
                    <p className="text-sm sm:text-base md:text-lg font-bricolage text-center text-muted-foreground max-w-4xl mx-auto px-2">
                        Connect with students and mentors who share scholarship application tips and insights.
                        <span className="hidden sm:inline">
                            <br />
                        </span>{" "}
                        Our community is here to help you at every step of your scholarship journey.
                    </p>
                </div>
            </AnimatedContent>

            <FadeContent
                blur={true}
                duration={1000}
                easing="ease-out"
                initialOpacity={0}
                className="w-full mt-4 sm:mt-6 md:mt-8 px-2 sm:px-4 md:px-6"
            >
                <div className="max-w-4xl mx-auto">
                    <LazyLoadImage
                        src={communityImg}
                        alt={"Community collaboration and scholarship discussion"}
                        className="w-full h-auto rounded-lg object-contain block dark:hidden"
                    />
                    <LazyLoadImage
                        src={communityImgDark}
                        alt={"Community collaboration and scholarship discussion"}
                        className="w-full h-auto rounded-lg object-contain hidden dark:block"
                    />
                </div>
            </FadeContent>
        </div>
    )
}

