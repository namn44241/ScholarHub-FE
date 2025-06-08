import { Sparkles } from "lucide-react"
import type { ReactNode } from "react"

interface IEmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: IEmptyStateProps) {
  return (
    <div className="flex flex-col justify-center items-center p-6 h-full text-center">
      <div className="bg-primary/5 mb-4 p-4 rounded-full">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>

      <h2 className="mb-2 font-semibold text-xl">{title}</h2>

      <p className="mb-6 max-w-md text-muted-foreground">{description}</p>

      {action}
    </div>
  )
}
