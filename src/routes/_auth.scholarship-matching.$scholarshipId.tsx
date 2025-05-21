import { ScholarshipMatching } from "@/features/scholarship_matching";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_auth/scholarship-matching/$scholarshipId"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { scholarshipId } = Route.useParams();
  return (
    <div className="flex flex-col py-6 min-h-screen container-wrapper">
      <div className="container">
        <ScholarshipMatching scholarshipId={scholarshipId} />
      </div>
    </div>
  );
}
