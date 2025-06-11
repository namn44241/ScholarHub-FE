import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";

interface Logo {
  name: string;
  id: number;
  img: string | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  imgDark?: string | React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface LogoCarouselProps {
  columnCount?: number;
  logos: Logo[];
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
};

const LogoColumn = ({
  logos,
  columnIndex,
}: {
  logos: Logo[];
  columnIndex: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % logos.length);
    }, 2000 + columnIndex * 200);

    return () => clearInterval(interval);
  }, [logos.length, columnIndex]);

  const currentLogo = logos[currentIndex];

  const getLogoSizeClass = (logoName: string) => {
    switch (logoName.toLowerCase()) {
      case "mit":
        return "h-16 w-16 md:h-24 md:w-64";
      case "ptit":
        return "h-10 w-10 md:h-20 md:w-12";
      default:
        return "h-20 w-20 md:h-32 md:w-32";
    }
  };

  return (
    <div className="relative w-24 md:w-48 h-14 md:h-24 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentLogo.id}-${currentIndex}`}
          className="absolute inset-0 flex justify-center items-center"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {typeof currentLogo.img === "string" ? (
            <>
              <img
                src={currentLogo.img}
                alt={currentLogo.name}
                className={`max-h-[80%] max-w-[80%] object-contain transition-none ${getLogoSizeClass(
                  currentLogo.name
                )} dark:hidden`}
              />
              {currentLogo.imgDark &&
                typeof currentLogo.imgDark === "string" && (
                  <img
                    src={currentLogo.imgDark}
                    alt={currentLogo.name}
                    className={`max-h-[80%] max-w-[80%] object-contain transition-none ${getLogoSizeClass(
                      currentLogo.name
                    )} hidden dark:block`}
                  />
                )}
              {!currentLogo.imgDark && (
                <img
                  src={currentLogo.img}
                  alt={currentLogo.name}
                  className={`max-h-[80%] max-w-[80%] object-contain transition-none ${getLogoSizeClass(
                    currentLogo.name
                  )} hidden dark:block`}
                />
              )}
            </>
          ) : (
            <currentLogo.img
              className={`max-h-[80%] max-w-[80%] object-contain transition-none ${getLogoSizeClass(
                currentLogo.name
              )}`}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export function LogoCarousel({ columnCount = 2, logos }: LogoCarouselProps) {
  const [logoSets, setLogoSets] = useState<Logo[][]>([]);

  useEffect(() => {
    // Distribute logos among columns
    const shuffled = shuffleArray(logos);
    const columns: Logo[][] = Array.from({ length: columnCount }, () => []);

    shuffled.forEach((logo, index) => {
      columns[index % columnCount].push(logo);
    });

    // Ensure all columns have the same length
    const maxLength = Math.max(...columns.map((col) => col.length));
    columns.forEach((col) => {
      while (col.length < maxLength) {
        col.push(shuffled[Math.floor(Math.random() * shuffled.length)]);
      }
    });

    setLogoSets(columns);
  }, [logos, columnCount]);

  return (
    <div className="flex space-x-4">
      {logoSets.map((columnLogos, index) => (
        <LogoColumn key={index} logos={columnLogos} columnIndex={index} />
      ))}
    </div>
  );
}
