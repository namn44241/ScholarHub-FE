import { ScholarshipSearch } from "@/features/scholarship_search";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/scholarship-search")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col py-6 min-h-screen container-wrapper">
      <div className="overflow-x-clip container">
        <ScholarshipSearch />
      </div>
    </div>
  );
}
