import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

interface IMatchingRadarChartProps {
  data: {
    name: string;
    matchPercentage: number;
    status?: string;
  }[];
}

export const MatchingRadarChart = ({ data }: IMatchingRadarChartProps) => {
  const chartData = data.map((item) => ({
    subject: item.name,
    score: item.matchPercentage,
    fullMark: 100,
  }))

  const chartConfig = {
    score: {
      label: "Match Score",
      color: "#7287fd",
    },
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className="mx-auto w-full h-full">
      <RadarChart data={chartData}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 500, fill: "#64748b" }} tickLine={false} />
        <Radar
          name="Match Score"
          dataKey="score"
          stroke="var(--color-score)"
          fill="var(--color-score)"
          fillOpacity={0.2}
          dot={{
            r: 6,
            fill: (({ value }: { value: number }) => {
              let fillColor = "#ff847d" 
              if (value >= 80) {
                fillColor = "#8cbe81" 
              } else if (value >= 50) {
                fillColor = "#e7cb80" 
              }
              return fillColor
            }) as unknown as string,
            stroke: "#fff",
            strokeWidth: 2,
          }}
        />
      </RadarChart>
    </ChartContainer>
  )
}
