import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ArrowRight, GraduationCap, RefreshCw } from "lucide-react";
import { useCallback, useState } from "react";
import {
  useForceRecreateScholarshipRecommend,
  useRecommendScholarships,
  useSearchScholarships,
} from "../hooks/useScholarship";
import type { SEARCH_KEYS } from "../utils/constants";
import type { FilterOption } from "../utils/types";
import MobileScholarshipFilter from "./mobile-scholarship-filter";
import ScholarshipFilter from "./scholarship-filter";
import ScholarshipPagination from "./scholarship-pagination";
import ScholarshipResults from "./scholarship-results";
import ScholarshipSearchInput from "./scholarship-search-input";

export const ScholarshipSearch = () => {
  const [currentSearchValue, setCurrentSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { isAuthenticated } = useAuth();
  const isMobile = useMediaQuery("(max-width: 767px)");

  const [alertOpen, setAlertOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const ITEMS_PER_PAGE = 20;
  const RECOMMENDATION_LIMIT = 20;

  // init recommendations
  const {
    data: recommendedScholarships = [],
    isLoading: isLoadingRecommendations,
  } = useRecommendScholarships({
    suggest: true,
    limit: RECOMMENDATION_LIMIT,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  // init search results
  const { data: searchResults = [], isLoading: isSearching } =
    useSearchScholarships(searchQuery);

  const { mutate: forceRecreateRecommend, isPending } =
    useForceRecreateScholarshipRecommend();

  const scholarships = searchQuery ? searchResults : recommendedScholarships;
  const isLoading = searchQuery ? isSearching : isLoadingRecommendations;

  const handleSearch = useCallback(() => {
    setSearchQuery(currentSearchValue);
    setCurrentPage(1);
  }, [currentSearchValue]);

  const handleSearchChange = (value: string) => {
    setCurrentSearchValue(value);
  };

  const removeFilter = (key: SEARCH_KEYS, value: string) => {
    setActiveFilters(
      activeFilters.filter(
        (filter) => !(filter.key === key && filter.value === value)
      )
    );
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRegenerateRecommendations = () => {
    setAlertOpen(false);
    setIsRegenerating(true);
    forceRecreateRecommend(undefined, {
      onSuccess: () => {
        setIsRegenerating(false);
      },
      onError: () => {
        setIsRegenerating(false);
      },
    });
  };

  const totalPages = Math.ceil(scholarships.length / ITEMS_PER_PAGE);

  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr] mx-auto w-full">
      {!isMobile && (
        <Card className="md:top-20 md:sticky border-muted-foreground/20 h-fit">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <GraduationCap className="size-6" />
              Search for Scholarships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScholarshipFilter
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
            />
          </CardContent>
        </Card>
      )}
      <div className="flex flex-col gap-6 max-w-full">
        <div className="items-center gap-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] max-w-full">
          {isMobile && (
            <div className="flex justify-center items-center gap-2 w-full font-semibold text-muted-foreground text-xl">
              <GraduationCap className="size-5" />
              <p className="">Search for Scholarships</p>
            </div>
          )}
          <div className="w-full">
            <ScholarshipSearchInput
              value={currentSearchValue}
              setValue={handleSearchChange}
              activeFilters={activeFilters}
              removeFilter={removeFilter}
              clearAllFilters={clearAllFilters}
              isAuthenticated={isAuthenticated}
              onSearch={handleSearch}
            />
          </div>
          {isMobile && (
            <div className="z-10 relative w-full sm:w-auto">
              <MobileScholarshipFilter
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
              />
            </div>
          )}
        </div>

        <div className="flex sm:flex-row flex-col-reverse justify-between items-start sm:items-center gap-2 sm:gap-0">
          <h2 className="font-semibold text-primary text-2xl">
            {isLoading
              ? "Getting scholarship data..."
              : searchQuery
              ? `${scholarships.length} scholarships found`
              : "Recommended scholarships for this week"}
          </h2>

          {!searchQuery && (
            <Button
              size="sm"
              onClick={() => setAlertOpen(true)}
              disabled={isRegenerating || isPending}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`size-4 ${
                  isRegenerating || isPending ? "animate-spin" : ""
                }`}
              />
              {isRegenerating || isPending
                ? "Regenerating..."
                : "Get New Recommendations"}
            </Button>
          )}
        </div>

        <ScholarshipResults
          scholarships={scholarships}
          isLoading={isLoading}
          showMatchScores={!!searchQuery.trim()}
          title=""
        />

        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Regenerate Recommendations</AlertDialogTitle>
              <AlertDialogDescription>
                This process will create new scholarship recommendations based
                on your profile. Please note that this may take 5-10 minutes to
                complete. You can continue using the application while the
                process runs in the background.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRegenerateRecommendations}>
                Proceed
                <ArrowRight className="size-4" />
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <ScholarshipPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
