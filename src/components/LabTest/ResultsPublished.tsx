import { navigate } from "raviger";

import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/LabTest/DataTable";
import { DataTableSkeleton } from "@/components/LabTest/DataTableSkeleton";

import routes from "@/Utils/request/api";
import useQuery from "@/Utils/request/useQuery";

export const ResultsPublished: React.FC = () => {
  const keys = [
    {
      key: "patientName",
      label: "Patient Name",
      type: "text",
      operators: ["is", "is_not", "contains", "does_not_contain"],
    },
    {
      key: "orderId",
      label: "Order ID",
      type: "text",
      operators: ["is", "is_not", "contains", "does_not_contain"],
    },
    {
      key: "specimen",
      label: "Specimen",
      type: "text",
      operators: ["is", "is_not", "contains", "does_not_contain"],
    },
    {
      key: "test",
      label: "Test",
      type: "text",
    },
    {
      key: "priority",
      label: "Priority",
      render_as: "badge",
      type: "radio", // New filter type
      options: ["High", "Medium", "Low"],
      operators: ["is"], // Typically, only "is" makes sense for radio
      defaultOperator: "is",
    },
  ];

  const { data } = useQuery(routes.labs.diagnosticReport.list, {
    query: {
      phase: "reviewed",
    },
  });

  if (!data) {
    return <DataTableSkeleton columns={keys} />;
  }

  return (
    <div className="p-4 space-y-4">
      {/* Data Table */}
      <DataTable
        columns={keys.map((key) => ({
          label: key.label,
          key: key.key,
          render_as: key.render_as,
        }))}
        data={
          data?.results?.map((report) => ({
            patientName: report.subject.name,
            orderId: report.based_on.id,
            specimen: report.specimen
              .map((specimen) => specimen.type.display || specimen.type.code)
              .join(", "),
            test: report.based_on.code.display || report.based_on.code.code,
            priority: report.based_on.priority || "Routine",
            id: report.id,
          })) ?? []
        }
        actions={(row) => (
          <Button
            onClick={() => navigate(`/lab_tests/${row.id}/result`)}
            variant="outline_primary"
          >
            View
          </Button>
        )}
      />
    </div>
  );
};
