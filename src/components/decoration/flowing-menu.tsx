"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import React, { useEffect, useState } from "react"

interface MenuItemProps {
  text: string
  image: string
}

interface FlowingMenuProps {
  items?: MenuItemProps[]
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({ items = [] }) => {
  const [itemHeight, setItemHeight] = useState("100%")

  useEffect(() => {
    if (items.length > 0) {
      setItemHeight(`${100 / items.length}%`)
    }
  }, [items.length])

  return (
    <div className="w-full h-full overflow-hidden">
      <nav className="flex flex-col h-full m-0 p-0">
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} style={{ height: itemHeight }} />
        ))}
      </nav>
    </div>
  )
}

const marqueeVariants: Variants = {
  hidden: (direction: "top" | "bottom") => ({
    y: direction === "top" ? "-101%" : "101%",
  }),
  visible: {
    y: "0%",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }, // expo ease
  },
  exit: (direction: "top" | "bottom") => ({
    y: direction === "top" ? "-101%" : "101%",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }, // expo ease
  }),
}

const marqueeInnerVariants: Variants = {
  hidden: (direction: "top" | "bottom") => ({
    y: direction === "top" ? "101%" : "-101%",
  }),
  visible: {
    y: "0%",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }, // expo ease
  },
  exit: (direction: "top" | "bottom") => ({
    y: direction === "top" ? "101%" : "-101%",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }, // expo ease
  }),
}

const MenuItem: React.FC<MenuItemProps & { style?: React.CSSProperties }> = ({ text, image, style }) => {
  const itemRef = React.useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isHovered, setIsHovered] = useState(false)
  const [direction, setDirection] = useState<"top" | "bottom">("top")

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number): "top" | "bottom" => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2)
    const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2)
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom"
  }

  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobile || !itemRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height)
    setDirection(edge)
    setIsHovered(true)
  }

  const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobile || !itemRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height)
    setDirection(edge)
    setIsHovered(false)
  }

  const repeatedMarqueeContent = React.useMemo(() => {
    return Array.from({ length: 10 }).map((_, idx) => (
      <React.Fragment key={idx}>
        <span className="text-[#060606] dark:text-white uppercase font-normal text-[4vh] leading-[1.2] p-[1vh_1vw_0]">
          {text}
        </span>
        <div
          className="w-[200px] h-[7vh] my-[2em] mx-[2vw] p-[1em_0] rounded-[50px] bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
      </React.Fragment>
    ))
  }, [text, image])

  return (
    <div className="flex-1 relative overflow-hidden text-center shadow-[0_-1px_0_0_#fff]" ref={itemRef} style={style}>
      <a
        className="flex items-center justify-center h-fit sm:h-full relative cursor-pointer uppercase no-underline font-semibold text-muted-foreground dark:text-white text-2xl sm:text-[4vh] hover:text-[#060606] focus:text-white focus-visible:text-[#060606]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {text}
      </a>
      {!isMobile && (
        <AnimatePresence custom={direction}>
          {isHovered && (
            <motion.div
              className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none bg-muted"
              variants={marqueeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={direction}
            >
              <motion.div
                className="h-full w-[200%] flex"
                variants={marqueeInnerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={direction}
              >
                <div className="flex items-center relative h-full w-[200%] will-change-transform animate-marquee">
                  {repeatedMarqueeContent}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

export default FlowingMenu
