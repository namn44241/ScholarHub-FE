import {
  Atom,
  Earth,
  Flag,
  GitCompare,
  GraduationCap,
  HandCoins,
} from "lucide-react";
import {
  COUNTRY_OPTIONS,
  DEGREE_LEVEL_OPTIONS,
  FUNDING_LEVEL_OPTIONS,
  MAJOR_OPTIONS,
  REGION_OPTIONS,
  SCHOLARSHIP_TYPE_OPTIONS,
  SEARCH_KEYS,
} from "./constants";

export const handleConvertSearchKeyToIncon = (value: string) => {
  switch (value) {
    case SEARCH_KEYS.SCHOLARSHIP_TYPE:
      return GitCompare;
    case SEARCH_KEYS.FUNDING_LEVEL:
      return HandCoins;
    case SEARCH_KEYS.DEGREE_LEVEL:
      return GraduationCap;
    case SEARCH_KEYS.REGION:
      return Earth;
    case SEARCH_KEYS.COUNTRY:
      return Flag;
    case SEARCH_KEYS.MAJOR:
      return Atom;
    default:
      return null;
  }
};

export const getOptionsForKey = (key: SEARCH_KEYS) => {
  switch (key) {
    case SEARCH_KEYS.SCHOLARSHIP_TYPE:
      return SCHOLARSHIP_TYPE_OPTIONS;
    case SEARCH_KEYS.FUNDING_LEVEL:
      return FUNDING_LEVEL_OPTIONS;
    case SEARCH_KEYS.DEGREE_LEVEL:
      return DEGREE_LEVEL_OPTIONS;
    case SEARCH_KEYS.REGION:
      return REGION_OPTIONS;
    case SEARCH_KEYS.COUNTRY:
      return COUNTRY_OPTIONS;
    case SEARCH_KEYS.MAJOR:
      return MAJOR_OPTIONS;
    default:
      return [];
  }
};
