import communityImg from "@/assets/images/landing/community.jpg";
import harvardLogo from "@/assets/images/landing/harvard.png";
import inspireGrowthImg from "@/assets/images/landing/inspire_growth.jpg";
import mitLogo from "@/assets/images/landing/mit.png";
import opportunitiesImg from "@/assets/images/landing/opportunities.jpg";
import ptitLogo from "@/assets/images/landing/ptit.png";
import searchingStep1 from "@/assets/images/landing/searching_step_1.png";
import searchingStep1Dark from "@/assets/images/landing/searching_step_1_dark.png";
import searchingStep2 from "@/assets/images/landing/searching_step_2.png";
import searchingStep2Dark from "@/assets/images/landing/searching_step_2_dark.png";
import searchingStep3 from "@/assets/images/landing/searching_step_3.png";
import searchingStep3Dark from "@/assets/images/landing/searching_step_3_dark.png";
import stanfordLogo from "@/assets/images/landing/stanford.png";
import utsLogoDark from "@/assets/images/landing/uts-dark.png";
import utsLogo from "@/assets/images/landing/uts.png";
import { ScanSearch, Sparkles, SquareUser } from "lucide-react";
import type { ISearchingStep } from "./types";

export const SEARCHING_STEP: ISearchingStep[] = [
  {
    id: 1,
    title: "Building your profile",
    description:
      "Answer a few quick questions about your academic background and preferences. Upload documents to enhance your matching potential.",
    icon: SquareUser,
    image: {
      light: searchingStep1,
      dark: searchingStep1Dark,
    },
  },
  {
    id: 2,
    title: "Finding the best matches",
    description:
      "Get personalized scholarship results based on your profile. Easily filter and sort to find your perfect matches.",
    icon: ScanSearch,
    image: {
      light: searchingStep2,
      dark: searchingStep2Dark,
    },
  },
  {
    id: 3,
    title: "Maximizing Your Opportunities",
    description:
      "Get personalized insights about your profile's compatibility with each scholarship. Receive strategic recommendations to strengthen your applications and increase your chances of success.",
    icon: Sparkles,
    image: {
      light: searchingStep3,
      dark: searchingStep3Dark,
    },
  },
];

export const PARTNERSHIP_LOGOS = [
  { name: "MIT", id: 1, img: mitLogo },
  { name: "Harvard University", id: 2, img: harvardLogo },
  {
    name: "University of Technology Sydney",
    id: 3,
    img: utsLogo,
    imgDark: utsLogoDark,
  },
  { name: "PTIT", id: 4, img: ptitLogo },
  { name: "Stanford University", id: 5, img: stanfordLogo },
];

export const CORE_VALUES = [
  {
    text: "Collaborative Community",
    image: communityImg,
  },
  {
    text: "Unlocking Potential",
    image: inspireGrowthImg,
  },
  {
    text: "Inspire Growth",
    image: opportunitiesImg,
  },
];
