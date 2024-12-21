import { navigate } from "raviger";

import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/LabTest/DataTable";
import { DataTableSkeleton } from "@/components/LabTest/DataTableSkeleton";

import routes from "@/Utils/request/api";
import useQuery from "@/Utils/request/useQuery";

export const SentToLab: React.FC = () => {
  const keys = [
    {
      key: "specimenId",
      label: "Specimen ID",
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
      key: "patientName",
      label: "Patient Name",
      type: "text",
      operators: ["is", "is_not", "contains", "does_not_contain"],
    },
    {
      key: "specimen",
      label: "Specimen",
      type: "checkbox",
      options: ["Blood", "Swab", "Tissue"],
      operators: ["is", "is_not"],
    },
    {
      key: "tests",
      label: "Tests",
      type: "text",
      operators: ["is", "contains", "does_not_contain"],
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

  const { data } = useQuery(routes.labs.specimen.list, {
    query: {
      phase: "sent",
    },
  });

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => navigate(`/lab_tests/receive_at_lab`)}
          variant={"primary"}
        >
          Receive at Lab
        </Button>
      </div>

      {/* Data Table */}
      {data ? (
        <DataTable
          columns={keys.map((key) => ({
            label: key.label,
            key: key.key,
            render_as: key.render_as,
          }))}
          data={
            data?.results?.map((specimen) => ({
              specimenId: specimen.identifier ?? specimen.id.slice(0, 8),
              orderId: specimen.request.id,
              patientName: specimen.subject.name,
              specimen: specimen.type.display || specimen.type.code,
              tests:
                specimen.request.code.display || specimen.request.code.code,
              priority: specimen.request.priority || "Routine",
              id: specimen.id,
            })) ?? []
          }
        />
      ) : (
        <DataTableSkeleton columns={keys} />
      )}
    </div>
  );
};
