import { UserProfile } from "@/features/user_profile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/profile/$userId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();

  return (
    <div className="py-6 min-h-screen container-wrapper">
      <div className="container">
        <UserProfile userId={userId} />
      </div>
    </div>
  );
}
