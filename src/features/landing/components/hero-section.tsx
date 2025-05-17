import heroImg from "@/assets/images/landing/hero_image.png"
import heroImgDark from "@/assets/images/landing/hero_image_dark.png"
import AnimatedContent from "@/components/decoration/animate-content"
import BlurText from "@/components/decoration/blur-text"
import FadeContent from "@/components/decoration/fade-content"
import { Button } from "@/components/ui/button"
import { useNavigate } from "@tanstack/react-router"
import { LogIn } from "lucide-react"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { scrollToSection } from "../utils/functions"
export const HeroSection = () => {
    const navigate = useNavigate()

    return (
        <div id="hero" className="w-full flex flex-col gap-3 sm:gap-6 items-center pt-6 sm:pt-12 md:pt-16 container-wrapper bg-background">
            <div className="flex flex-col items-center text-center w-full max-w-full font-garamond container">
                <BlurText
                    delay={0.15}
                    animateBy="words"
                    direction="top"
                    className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-8xl"
                    text="welcome to"
                />

                <div className="w-full flex flex-row flex-wrap justify-center items-center gap-1 xs:gap-2 sm:gap-4">
                    <div className="flex flex-nowrap whitespace-nowrap">
                        <BlurText
                            delay={200}
                            animateBy="words"
                            direction="top"
                            className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-8xl"
                            text="the"
                        />
                        <span className="w-1 xs:w-2 sm:w-4"></span>
                        <BlurText
                            className="italic text-primary text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-8xl"
                            delay={200}
                            animateBy="words"
                            direction="top"
                            text="ScholarHub"
                        />
                        <span className="w-1 xs:w-2 sm:w-4"></span>
                        <BlurText
                            delay={200}
                            animateBy="words"
                            direction="top"
                            className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-8xl"
                            text="community"
                        />
                    </div>
                </div>
            </div>

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
                <div className="w-full container">
                    <p className="text-xs xs:text-sm sm:text-base md:text-lg font-bricolage text-center">
                        Personalized scholarship matching, Knowledge sharing, Network building, and more.
                    </p>
                    <p className="text-xs xs:text-sm sm:text-base md:text-lg font-bricolage text-center">
                        We're with you every step of the way.
                    </p>
                </div>
            </AnimatedContent>

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
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 w-full container">
                    <Button
                        onClick={() => navigate({ to: "/auth/login" })}
                        className="w-full sm:w-auto text-xs sm:text-sm"
                        size="sm"
                    >
                        Login to start matching
                        <LogIn className="ml-1 size-3 sm:size-4" />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => scrollToSection("features")}
                        className="w-full sm:w-auto mt-2 sm:mt-0 text-xs sm:text-sm"
                        size="sm"
                    >
                        Or keep exploring our platform
                    </Button>
                </div>
            </AnimatedContent>

            <FadeContent
                blur={true}
                duration={1000}
                easing="ease-out"
                initialOpacity={0}
                className="container max-h-[150px] sm:max-h-[250px] md:max-h-[350px] lg:max-h-[400px] overflow-hidden"
            >
                <LazyLoadImage
                    src={heroImg || "/placeholder.png"}
                    alt="Image"
                    className="w-full h-full object-cover border rounded-xl dark:hidden shadow-sm"
                />
                <LazyLoadImage
                    src={heroImgDark || "/placeholder.png"}
                    alt="Image"
                    className="w-full h-full object-cover  border rounded-xl shadow-sm dark:inset-shadow-white/20"
                />
            </FadeContent>
        </div>
    )
}


