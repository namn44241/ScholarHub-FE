import { Community } from "@/features/community";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/community")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col py-6 min-h-screen container-wrapper">
      <div className="container">
        <Community />
      </div>
    </div>
  );
}
