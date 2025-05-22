import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, UserPlus } from "lucide-react";
import { SAMPLE_CONNECTIONS } from "../utils/constants";

export const NetworkSuggestions = () => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">People you may know</CardTitle>
      </CardHeader>
      <CardContent className="gap-4 grid">
        {SAMPLE_CONNECTIONS.map((connection) => (
          <div key={connection.id} className="flex items-start gap-3">
            <Avatar className="size-12">
              <AvatarImage
                src={connection.avatar || "/placeholder.svg"}
                alt={connection.name}
              />
              <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="font-medium text-sm leading-none">
                {connection.name}
              </p>
              <p className="text-muted-foreground text-xs">{connection.role}</p>
              <p className="text-muted-foreground text-xs">
                {connection.mutualConnections} mutual connections
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-muted-foreground/20 w-full h-8 text-xs"
              >
                <UserPlus className="size-4" />
                Connect
              </Button>
            </div>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="w-full text-primary">
          Explore networks
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
