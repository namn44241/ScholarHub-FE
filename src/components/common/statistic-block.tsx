import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { Badge } from "../ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { cn } from "@/lib/utils"

const StatisticBlock = ({
  title,
  value,
  trendingType,
  trendingValue,
  colorVariant = "default",
}: {
  title: string
  value: string | number
  trendingType: "up" | "down"
  trendingValue: string | number
  colorVariant?: "default" | "blue" | "green" | "destructive"
}) => {
    
  const cardClasses = cn(
    "@container/card",
    colorVariant === "default" && "bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30",
    colorVariant === "blue" && "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
    colorVariant === "green" && "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
    colorVariant === "destructive" && "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
  )

  const titleClasses = cn(
    colorVariant === "default" && "text-primary dark:text-primary/90",
    colorVariant === "blue" && "text-blue-600 dark:text-blue-400",
    colorVariant === "green" && "text-green-600 dark:text-green-400",
    colorVariant === "destructive" && "text-red-600 dark:text-red-400",
  )

  const badgeClasses = cn(
    "flex gap-1 rounded-lg text-xs",
    colorVariant === "default" && "border-primary/20 dark:border-primary/30 text-primary dark:text-primary/90",
    colorVariant === "blue" && "border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400",
    colorVariant === "green" && "border-green-200 dark:border-green-800 text-green-600 dark:text-green-400",
    colorVariant === "destructive" && "border-red-200 dark:border-red-800 text-red-600 dark:text-red-400",
  )

  const iconClasses = cn("size-4", trendingType === "down" && "rotate-180")

  return (
    <Card className={cardClasses}>
      <CardHeader className="relative">
        <CardDescription className={titleClasses}>{title}</CardDescription>
        <CardTitle className="font-semibold tabular-nums text-2xl @[250px]/card:text-3xl">{value}</CardTitle>
        <div className="top-4 right-4 absolute">
          <Badge variant="outline" className={badgeClasses}>
            {trendingType === "up" ? (
              <TrendingUpIcon className={iconClasses} />
            ) : (
              <TrendingDownIcon className={iconClasses} />
            )}
            {trendingType === "up" ? `+${trendingValue}` : `-${trendingValue}`}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  )
}

export default StatisticBlock
