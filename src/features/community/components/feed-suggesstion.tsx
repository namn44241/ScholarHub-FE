import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, UserPlus } from "lucide-react"
import { SAMPLE_CONNECTIONS } from "../utils/constants"

const FeedSuggestion = () => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Follow for more interesting feeds</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {SAMPLE_CONNECTIONS.map((connection) => (
          <div key={connection.id} className="flex items-start gap-3">
            <Avatar className="size-12">
              <AvatarImage src={connection.avatar || "/placeholder.svg"} alt={connection.name} />
              <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{connection.name}</p>
              <p className="text-xs text-muted-foreground">{connection.role}</p>
              <p className="text-xs text-muted-foreground">{connection.mutualConnections} mutual connections</p>
              <Button variant="outline" size="sm" className="mt-2 w-full text-xs h-8 border-muted-foreground/20">
                <UserPlus className="size-4" />
                Follow
              </Button>
            </div>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="w-full  text-primary">
          See more recommendations
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default FeedSuggestion