import type { SEARCH_KEYS } from "./constants";

export type FilterOption = {
  key: SEARCH_KEYS;
  value: string;
};

export interface IScholarshipSearchInputProps {
  value: string;
  setValue: (value: string) => void;
  activeFilters: any[];
  removeFilter: (key: SEARCH_KEYS, value: string) => void;
  clearAllFilters: () => void;
  isAuthenticated: boolean;
}

export type IScholarshipWeightCriteria =
  | "education_criteria"
  | "personal_criteria"
  | "experience_criteria"
  | "research_criteria"
  | "certification_criteria"
  | "achievement_criteria";

export interface IScholarshipDetailsDialogProps {
  scholarship: IScholarship & { matchScore?: number };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showMatchScore?: boolean;
  matchBadgeColor?: string;
}

export interface IScholarshipFilterProps {
  activeFilters: FilterOption[];
  setActiveFilters: (filters: FilterOption[]) => void;
}

export interface ISelectedFiltersProps {
  activeFilters: FilterOption[];
  removeFilter: (key: SEARCH_KEYS, value: string) => void;
  clearAllFilters: () => void;
}

export interface IScholarshipResultsContentProps {
  title: string;
  scholarships: IScholarship[];
}

export interface IScholarshipResultsProps {
  title: string;
  scholarships: IScholarship[];
  isLoading: boolean;
}
