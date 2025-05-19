"use client";

import {
  cubicBezier,
  motion,
  type Variant,
  type Variants,
} from "framer-motion";
import type React from "react";
import { forwardRef, useRef } from "react";

interface BlurTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text?: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, any>;
  animationTo?: Record<string, any>[];
  easing?: string | [number, number, number, number];
  onAnimationComplete?: () => void;
}

const BlurText = forwardRef<HTMLParagraphElement, BlurTextProps>(
  (
    {
      text = "",
      delay = 0.2, // Changed to seconds for Framer Motion
      className = "",
      animateBy = "words",
      direction = "top",
      threshold = 0.1,
      rootMargin = "0px",
      animationFrom,
      animationTo,
      easing = [0.33, 0.66, 0.66, 1], // easeOutCubic in cubic-bezier form
    },
    ref
  ) => {
    const elements = animateBy === "words" ? text.split(" ") : text.split("");
    const internalRef = useRef<HTMLParagraphElement>(null);

    // Default animations based on direction
    const defaultFrom =
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 };

    const defaultTo = [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      {
        filter: "blur(0px)",
        opacity: 1,
        y: 0,
      },
    ];

    // Create variants for the animation sequence
    const createVariants = (index: number): Variants => {
      const from = animationFrom || defaultFrom;
      const to = animationTo || defaultTo;

      const variants: Record<string, Variant> = {
        hidden: from,
        visible: {
          ...to[to.length - 1],
          transition: {
            delay: index * (delay / 1000), // Convert to seconds
            duration: 0.5,
            ease:
              typeof easing === "string"
                ? easing
                : cubicBezier(...(easing as [number, number, number, number])),
          },
        },
      };

      // Add intermediate steps if they exist
      if (to.length > 1) {
        for (let i = 0; i < to.length - 1; i++) {
          variants[`step${i}`] = {
            ...to[i],
            transition: {
              delay: index * (delay / 1000), // Convert to seconds
              duration: 0.3,
              ease:
                typeof easing === "string"
                  ? easing
                  : cubicBezier(
                      ...(easing as [number, number, number, number])
                    ),
            },
          };
        }
      }

      return variants;
    };

    const handleAnimationComplete = () => {};

    return (
      <motion.p
        ref={ref || internalRef}
        className={`blur-text ${className} flex flex-wrap`}
        viewport={{
          once: true,
          amount: threshold,
          margin: rootMargin,
        }}
      >
        {elements.map((element, index) => {
          const variants = createVariants(index);
          const to = animationTo || defaultTo;

          return (
            <motion.span
              key={index}
              initial="hidden"
              whileInView={to.length > 1 ? ["step0", "visible"] : "visible"}
              variants={variants}
              viewport={{ once: true, amount: threshold, margin: rootMargin }}
              className="inline-block will-change-[transform,filter,opacity]"
              onAnimationComplete={handleAnimationComplete}
            >
              {element === " " ? "\u00A0" : element}
              {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
            </motion.span>
          );
        })}
      </motion.p>
    );
  }
);

BlurText.displayName = "BlurText";

export default BlurText;
