import { useView, ViewProvider, type View } from "@/contexts/view-context"
import { ViewToggle } from "@/components/common/view-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ListFilter } from "lucide-react"
import { useEffect } from "react"
import { SEARCH_KEYS } from "../utils/constants"
import type { IScholarshipResultsContentProps, IScholarshipResultsProps } from "../utils/types"
import ScholarshipInfoCard from "./scholarship-info-card"

interface IExtendedScholarshipResultsContentProps extends IScholarshipResultsContentProps {
  groupedScholarships?: {
    high?: any[];
    medium?: any[];
    low?: any[];
    all?: any[];
  };
  allGroupedCounts?: {
    high: number;
    medium: number;
    low: number;
  };
  showMatchScores?: boolean;
}

interface IExtendedScholarshipResultsProps extends IScholarshipResultsProps {
  groupedScholarships?: {
    high?: any[];
    medium?: any[];
    low?: any[];
    all?: any[];
  };
  allGroupedCounts?: {
    high: number;
    medium: number;
    low: number;
  };
  showMatchScores?: boolean;
}

const ScholarshipResultsSection = ({
  title,
  scholarships,
  view,
  showMatchScores = false,
  matchBadgeColor = "bg-emerald-500",
  totalCount
}: {
  title: string;
  scholarships: any[];
  view: View;
  showMatchScores?: boolean;
  matchBadgeColor?: string;
  totalCount?: number;
}) => {
  if (!scholarships || scholarships.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 font-medium text-lg">
        {title} <span className="font-normal text-muted-foreground text-sm">({totalCount || scholarships.length})</span>
      </h3>
      <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4" : "flex flex-col gap-4"}>
        {scholarships.map((scholarship) => (
          <ScholarshipInfoCard
            key={scholarship.id}
            info={scholarship}
            view={view}
            showMatchScore={showMatchScores}
            matchBadgeColor={matchBadgeColor}
          />
        ))}
      </div>
    </div>
  );
};

const ScholarshipResultsContent = ({
  scholarships,
  groupedScholarships,
  allGroupedCounts,
  showMatchScores = false
}: IExtendedScholarshipResultsContentProps) => {
  const { view, setView } = useView()
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    if (isMobile) {
      setView("list")
    }
  }, [isMobile, setView])

  return (
    <div className="space-y-4 w-full">
      <div className="flex sm:flex-row flex-col justify-between items-center gap-4">
        <div className="flex items-center self-end sm:self-auto gap-2">
          {!isMobile && <ViewToggle />}
          <Select>
            <SelectTrigger className="bg-background border-muted-foreground/20">
              <ListFilter className="size-4" />
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent align="end">
              {Object.values(SEARCH_KEYS).map((key) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
              {showMatchScores && (
                <SelectItem value="matchScore">Match Score</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {scholarships.length > 0 ? (
        <div className="space-y-8">
          {groupedScholarships ? (
            <>
              {groupedScholarships.high && groupedScholarships.high.length > 0 && (
                <ScholarshipResultsSection
                  title="Best Matches (70%+)"
                  scholarships={groupedScholarships.high}
                  view={view}
                  showMatchScores={showMatchScores}
                  matchBadgeColor="bg-emerald-500"
                  totalCount={allGroupedCounts?.high}
                />
              )}

              {groupedScholarships.medium && groupedScholarships.medium.length > 0 && (
                <ScholarshipResultsSection
                  title="Good Matches (50-69%)"
                  scholarships={groupedScholarships.medium}
                  view={view}
                  showMatchScores={showMatchScores}
                  matchBadgeColor="bg-amber-500"
                  totalCount={allGroupedCounts?.medium}
                />
              )}

              {groupedScholarships.low && groupedScholarships.low.length > 0 && (
                <ScholarshipResultsSection
                  title="Other Matches (<50%)"
                  scholarships={groupedScholarships.low}
                  view={view}
                  showMatchScores={showMatchScores}
                  matchBadgeColor="bg-gray-500"
                  totalCount={allGroupedCounts?.low}
                />
              )}
            </>
          ) : (
            // Default view without grouping
            <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "flex flex-col gap-4"}>
              {scholarships.map((scholarship, index) => (
                <ScholarshipInfoCard
                  key={index}
                  info={scholarship}
                  view={view}
                  showMatchScore={showMatchScores}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center py-12 text-center">
          <p className="font-medium text-muted-foreground text-lg">No scholarships found matching your search criteria</p>
          <p className="mt-2 text-muted-foreground text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

const ScholarshipResults = ({
  title,
  scholarships,
  groupedScholarships,
  allGroupedCounts,
  isLoading = false,
  showMatchScores = false
}: IExtendedScholarshipResultsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (scholarships.length === 0) {
    return (
      <Card className="border-muted-foreground/20">
        <CardContent className="flex flex-col justify-center items-center p-8 text-center">
          <p className="font-semibold text-lg">No scholarships found</p>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <ViewProvider>
        <ScholarshipResultsContent
          title={title}
          scholarships={scholarships}
          groupedScholarships={groupedScholarships}
          allGroupedCounts={allGroupedCounts}
          showMatchScores={showMatchScores}
        />
      </ViewProvider>
    </div>
  )
}

const LoadingSkeleton = () => (
  <Card className="border-muted-foreground/20 overflow-hidden">
    <CardContent className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <Skeleton className="w-1/3 h-6" />
          <Skeleton className="w-24 h-6" />
        </div>
        <Skeleton className="w-1/2 h-4" />
        <div className="flex flex-wrap gap-2 mt-2">
          <Skeleton className="w-20 h-8" />
          <Skeleton className="w-24 h-8" />
          <Skeleton className="w-16 h-8" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export default ScholarshipResults