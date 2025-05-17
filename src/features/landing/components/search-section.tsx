"use client"

import AnimatedContent from "@/components/decoration/animate-content"
import FadeContent from "@/components/decoration/fade-content"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useNavigate } from "@tanstack/react-router"
import { MoveRight } from "lucide-react"
import { useState } from "react"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { SEARCHING_STEP } from "../utils/constant"

export const SearchSection = () => {
    const [activeStep, setActiveStep] = useState<number>(1)
    const navigate = useNavigate()

    return (
        <div id="features" className="w-full bg-muted">
            <div className="container-wrapper flex flex-col items-center gap-4 sm:gap-6 py-8 sm:py-12 md:py-16">
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
                    <div className="container">
                        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-2 sm:mb-4">
                            A brand-new scholarship searching experience
                        </p>
                        <p className="text-sm sm:text-base md:text-lg font-bricolage text-center text-muted-foreground max-w-3xl mx-auto">
                            Our smart, adaptive searching algorithm breaks down language barriers, helping you find scholarship
                            opportunities that truly fit your unique profile.
                        </p>
                    </div>
                </AnimatedContent>

                <FadeContent
                    blur={true}
                    duration={1000}
                    easing="ease-out"
                    initialOpacity={0}
                    className="mt-4 sm:mt-6 md:mt-8 container"
                >
                    <div className="bg-background rounded-lg shadow-md sm:shadow-lg overflow-hidden">
                        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-0">
                            {/* Mobile step selector */}
                            <div className="md:hidden flex overflow-x-auto p-4 gap-2 border-b scrollbar-hide">
                                {SEARCHING_STEP.map((step) => (
                                    <button
                                        key={`mobile-${step.id}`}
                                        onClick={() => setActiveStep(step.id)}
                                        className={cn(
                                            "flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-full text-sm font-medium transition-colors",
                                            activeStep === step.id
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-primary/10 text-primary hover:bg-primary/20",
                                        )}
                                    >
                                        <step.icon className="size-3.5" />
                                        <span>Step {step.id}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Image section for mobile */}
                            <div className="md:hidden relative h-[200px] sm:h-[225px]">
                                {SEARCHING_STEP.map((step) => (
                                    <div
                                        key={`mobile-img-${step.id}`}
                                        className={cn(
                                            "absolute inset-0 transition-opacity duration-500 p-4",
                                            activeStep === step.id ? "opacity-100" : "opacity-0 pointer-events-none",
                                        )}
                                    >
                                        <LazyLoadImage
                                            src={step.image.light || "/placeholder.svg"}
                                            alt={`Illustration for ${step.title}`}
                                            className="w-full h-full object-contain dark:hidden"
                                        />
                                        <LazyLoadImage
                                            src={step.image.dark || "/placeholder.svg"}
                                            alt={`Illustration for ${step.title}`}
                                            className="w-full h-full object-contain hidden dark:block"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Steps content */}
                            <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-center gap-2">
                                {SEARCHING_STEP.map((step) => (
                                    <div
                                        key={step.id}
                                        onClick={() => setActiveStep(step.id)}
                                        className={cn(
                                            "transition-all duration-300 space-y-2 p-2 cursor-pointer",
                                            activeStep === step.id
                                                ? "bg-primary/5 -mx-2 sm:-mx-4 px-2 sm:px-4 rounded-lg"
                                                : "hover:bg-primary/5 -mx-2 sm:-mx-4 px-2 sm:px-4 rounded-lg",
                                            activeStep !== step.id && "hidden md:block",
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center justify-center size-6 sm:size-8 rounded-full bg-primary/10 text-primary">
                                                <step.icon className="size-3 sm:size-4" />
                                            </div>
                                            <span className="text-sm sm:text-base md:text-lg font-medium text-primary">Step {step.id}</span>
                                        </div>

                                        <p className="text-lg sm:text-xl md:text-2xl font-semibold">{step.title}</p>
                                        <p className="text-sm sm:text-base text-muted-foreground">{step.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Image section for desktop  */}
                            <div className="hidden md:block relative aspect-[16/9] md:aspect-auto md:min-h-[400px] lg:min-h-[450px] overflow-hidden">
                                {SEARCHING_STEP.map((step) => (
                                    <div
                                        key={`desktop-img-${step.id}`}
                                        className={cn(
                                            "absolute inset-0 transition-opacity duration-500 p-4",
                                            activeStep === step.id ? "opacity-100" : "opacity-0 pointer-events-none",
                                        )}
                                    >
                                        <LazyLoadImage
                                            src={step.image.light || "/placeholder.svg"}
                                            alt={`Illustration for ${step.title}`}
                                            className="w-full h-full object-contain dark:hidden rounded-lg"
                                        />
                                        <LazyLoadImage
                                            src={step.image.dark || "/placeholder.svg"}
                                            alt={`Illustration for ${step.title}`}
                                            className="w-full h-full object-contain hidden dark:block"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </FadeContent>

                <AnimatedContent
                    distance={50}
                    delay={300}
                    direction="vertical"
                    reverse={false}
                    transition={{ type: "spring", stiffness: 100, damping: 30 }}
                    initialOpacity={0}
                    animateOpacity
                    threshold={0.2}
                >
                    <Button
                        className="text-base sm:text-lg shadow-md sm:shadow-lg px-4 sm:px-6 py-2 sm:py-2.5 mt-4 sm:mt-6"
                        onClick={() => navigate({ to: "/scholarship-search" })}
                    >
                        Try it yourself!
                        <MoveRight className="size-4 sm:size-5 md:size-6" />
                    </Button>
                </AnimatedContent>
            </div>
        </div>
    )
}
