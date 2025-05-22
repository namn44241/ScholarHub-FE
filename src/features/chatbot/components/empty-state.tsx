import type { ReactNode } from "react"

interface IEmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: IEmptyStateProps) {
  return (
    <div className="flex flex-col justify-center items-center p-4 md:p-8 h-full text-center">
      <h2 className="mb-2 font-semibold text-2xl">{title}</h2>
      <p className="mb-6 max-w-md text-muted-foreground">{description}</p>
      {action}
    </div>
  )
}
