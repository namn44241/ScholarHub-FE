import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useMediaQuery } from "@/hooks/use-media-query"
import { X } from "lucide-react"
import { SEARCH_KEYS } from "../utils/constants"
import type { ISelectedFiltersProps } from "../utils/types"

const SelectedFilters = ({ activeFilters, removeFilter, clearAllFilters }: ISelectedFiltersProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)")

  if (activeFilters.length === 0) return null

  const groupedFilters = activeFilters.reduce(
    (acc, filter) => {
      const key = filter.key as SEARCH_KEYS
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(filter.value)
      return acc
    },
    {} as Record<SEARCH_KEYS, string[]>,
  )

  // Mobile view
  if (isMobile) {
    return (
      <Card className="p-2 border-muted-foreground/20 rounded-lg w-full select-none">
        <div className="flex justify-between items-center mb-1.5">
          <p className="font-medium text-muted-foreground text-xs">Filters ({activeFilters.length})</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="px-2 h-6 text-muted-foreground hover:text-foreground text-xs"
          >
            Clear all
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {activeFilters.map((filter) => (
            <Badge
              key={`${filter.key}-${filter.value}`}
              variant="outline"
              className="flex items-center gap-0.5 bg-primary/5 py-0.5 pr-0.5 pl-1.5 border-primary/10 text-primary text-xs"
            >
              <span className="max-w-[100px] truncate">{filter.value}</span>
              <Button
                size="sm"
                variant="ghost"
                className="hover:bg-primary/10 p-0 rounded-full size-4"
                onClick={() => removeFilter(filter.key, filter.value)}
              >
                <X className="size-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </Card>
    )
  }

  // Desktop view
  return (
    <Card className="p-3 border-muted-foreground/20 rounded-lg w-full select-none">
      <div className="flex justify-between items-start">
        <p className="font-semibold text-sm">Selected Filters</p>
        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground text-sm"
            size="sm"
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {Object.entries(groupedFilters).map(([key, values]) => (
          <div key={key} className="flex items-center gap-2 bg-background shadow-sm p-1.5 border rounded-lg">
            <span className="px-1.5 font-medium text-muted-foreground text-xs">{key}:</span>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => (
                <Badge key={`${key}-${value}`} variant="secondary" className="border-none text-primary">
                  {value}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-primary/20 rounded-full hover:text-primary"
                    onClick={() => removeFilter(key as SEARCH_KEYS, value)}
                  >
                    <X className="size-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default SelectedFilters

