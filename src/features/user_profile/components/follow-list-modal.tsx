import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { BACKEND_IP } from "@/utils/endpoints";
import {
  useGetFollowersList,
  useGetFollowingList,
} from "../hooks/use-follow-list";

interface IFollowUser {
  user_id: string;
  email: string;
  avatar?: string;
  banner?: string;
}

interface IFollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  type: "followers" | "following";
  title: string;
}

export const FollowListModal = ({
  isOpen,
  onClose,
  userId,
  type,
  title,
}: IFollowListModalProps) => {
  const { data: followersData, isLoading: followersLoading } =
    useGetFollowersList(userId, isOpen && type === "followers");

  const { data: followingData, isLoading: followingLoading } =
    useGetFollowingList(userId, isOpen && type === "following");

  const isLoading = followersLoading || followingLoading;
  const users: IFollowUser[] =
    type === "followers"
      ? followersData?.followers || []
      : followingData?.following || [];

  const getImageUrl = (path: string | undefined) => {
    if (!path) return "/placeholder.svg";
    if (path.startsWith("http")) return path;
    return `${BACKEND_IP}/${path}`;
  };

  const getUserDisplayName = (email: string) => {
    return email.split("@")[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-2">
                <Skeleton className="rounded-full w-10 h-10" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-32 h-3" />
                </div>
                <Skeleton className="w-16 h-8" />
              </div>
            ))
          ) : users.length === 0 ? (
            // Empty state
            <div className="py-8 text-muted-foreground text-center">
              {type === "followers" ? "Chưa có ai follow" : "Chưa follow ai"}
            </div>
          ) : (
            // User list
            users.map((user) => (
              <div
                key={user.user_id}
                className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-lg"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={getImageUrl(user.avatar)} />
                  <AvatarFallback>
                    {getUserDisplayName(user.email)[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {getUserDisplayName(user.email)}
                  </p>
                  <p className="text-muted-foreground text-xs truncate">
                    {user.email}
                  </p>
                </div>

                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
