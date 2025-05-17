

import { AnimatePresence, motion } from "framer-motion"
import type React from "react"
import { useEffect, useState } from "react"

interface Logo {
    name: string
    id: number
    img: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

interface LogoCarouselProps {
    columnCount?: number
    logos: Logo[]
}

// Simplified animation without any filter properties
const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3 },
    },
}

const LogoColumn = ({ logos, columnIndex }: { logos: Logo[]; columnIndex: number }) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(
            () => {
                setCurrentIndex((prev) => (prev + 1) % logos.length)
            },
            2000 + columnIndex * 200,
        )

        return () => clearInterval(interval)
    }, [logos.length, columnIndex])

    const CurrentLogo = logos[currentIndex].img

    return (
        <div className="relative h-14 w-24 overflow-hidden md:h-24 md:w-48">
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${logos[currentIndex].id}-${currentIndex}`}
                    className="absolute inset-0 flex items-center justify-center"
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <CurrentLogo className="h-20 w-20 max-h-[80%] max-w-[80%] object-contain md:h-32 md:w-32" />
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

export function LogoCarousel({ columnCount = 2, logos }: LogoCarouselProps) {
    const [logoSets, setLogoSets] = useState<Logo[][]>([])

    useEffect(() => {
        // Distribute logos among columns
        const shuffled = shuffleArray(logos)
        const columns: Logo[][] = Array.from({ length: columnCount }, () => [])

        shuffled.forEach((logo, index) => {
            columns[index % columnCount].push(logo)
        })

        // Ensure all columns have the same length
        const maxLength = Math.max(...columns.map((col) => col.length))
        columns.forEach((col) => {
            while (col.length < maxLength) {
                col.push(shuffled[Math.floor(Math.random() * shuffled.length)])
            }
        })

        setLogoSets(columns)
    }, [logos, columnCount])

    return (
        <div className="flex space-x-4">
            {logoSets.map((columnLogos, index) => (
                <LogoColumn key={index} logos={columnLogos} columnIndex={index} />
            ))}
        </div>
    )
}

