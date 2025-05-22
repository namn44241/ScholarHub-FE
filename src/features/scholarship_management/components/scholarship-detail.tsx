import StatisticBlock from "@/components/common/statistic-block";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ApplicationTable } from "./application-table";

export const ScholarshipDetail = () => {
  const scholarshipName =
    "PhD Scholarship in Artificial Intelligence and Deep Learning";

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Scholarship Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{scholarshipName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatisticBlock
          title="Total Applications"
          value={12}
          trendingType="up"
          trendingValue={2}
        />
        <StatisticBlock
          title="Pending Applications"
          value={5}
          trendingType="up"
          trendingValue={0}
          colorVariant="blue"
        />
        <StatisticBlock
          title="Approved Applications"
          value={6}
          trendingType="up"
          trendingValue={1}
          colorVariant="green"
        />
        <StatisticBlock
          title="Rejected Applications"
          value={1}
          trendingType="up"
          trendingValue={0}
          colorVariant="destructive"
        />
      </div>

      <ApplicationTable />
    </div>
  );
};
