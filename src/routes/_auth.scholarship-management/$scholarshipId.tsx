import { ScholarshipDetail } from "@/features/scholarship_management";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_auth/scholarship-management/$scholarshipId"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col py-6 min-h-screen container">
      <div className="container-wrapper">
        <ScholarshipDetail />
      </div>
    </div>
  );
}
