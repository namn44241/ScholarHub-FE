import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { communityService } from "../services/community";

export const NetworkSuggestions = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      setLoading(true);
      const response = await communityService.getConnectionSuggestions();
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
          <div className="space-y-4 animate-pulse">
            {[1,2,3].map(i => (
              <div key={i} className="flex gap-3">
                <div className="bg-gray-200 rounded-full w-12 h-12"></div>
                <div className="flex-1">
                  <div className="bg-gray-200 mb-2 rounded w-3/4 h-4"></div>
                  <div className="bg-gray-200 rounded w-1/2 h-3"></div>
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
      <CardContent className="gap-4 grid">
        {connections.map((connection: any) => (
          <div key={connection.id} className="flex items-start gap-3">
            <Avatar className="size-12">
              <AvatarImage
                src={connection.avatar || undefined}
                alt={connection.name}
              />
              <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                {connection.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="font-medium text-sm leading-none">{connection.name}</p>
              <p className="text-muted-foreground text-xs">{connection.role}</p>
              <p className="text-muted-foreground text-xs">{connection.mutualConnections} mutual connections</p>
              <Button variant="outline" size="sm" className="mt-2 border-muted-foreground/20 w-full h-8 text-xs">
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
