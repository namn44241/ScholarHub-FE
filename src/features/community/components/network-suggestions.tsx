import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { communityApi } from "../services/community-api";

export const NetworkSuggestions = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      setLoading(true);
      const response = await communityApi.getConnectionSuggestions();
      if (response.success) {
        setConnections(response.payload.connections);
      }
    } catch (err) {
      console.error('Error loading connections:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">People you may know</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="flex gap-3">
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">People you may know</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {connections.map((connection: any) => (
          <div key={connection.id} className="flex items-start gap-3">
            <Avatar className="size-12">
              <AvatarImage
                src={connection.avatar || "/placeholder.svg"}
                alt={connection.name}
              />
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
        <Button variant="ghost" size="sm" className="w-full text-primary">
          Explore networks
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
