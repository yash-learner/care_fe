import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "raviger";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import TableAbstract from "@/components/Lab/pages/LabOrderTabs/TableAbstract";

import routes from "@/Utils/request/api";
import query from "@/Utils/request/query";
import { displayCode } from "@/Utils/utils";
import { DiagnosticReport } from "@/types/emr/diagnosticReport";

import { displayServiceRequestId, getPriorityColor } from "../../utils";

export default function Results() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns: ColumnDef<DiagnosticReport>[] = [
    {
      header: "Patient Name",
      cell: ({ row }) => (
        <div>
          <p className="capitalize">{row.original.subject.name}</p>
          <p className="text-sm text-gray-400">
            {row.original.subject.id?.slice(0, 8)}
          </p>
        </div>
      ),
    },
    {
      accessorFn: (row) => displayServiceRequestId(row.based_on),
      header: "Order ID",
    },
    {
      accessorFn: (row) =>
        row.specimen.map((s) => displayCode(s.type)).join(", "),
      header: "Specimen",
    },
    {
      accessorFn: (row) => displayCode(row.based_on.code),
      header: "Test Ordered",
    },
    {
      header: "Priority",
      cell: ({ row }) => (
        <Badge
          className={cn(
            "capitalize text-sm font-semibold",
            getPriorityColor(row.original.based_on.priority),
          )}
          variant="outline"
        >
          {row.original.based_on.priority}
        </Badge>
      ),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <Button
          onClick={() => navigate(`/lab_orders/${row.original.id}/result`)}
          variant="secondary"
        >
          {t("view")}
        </Button>
      ),
    },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["diagnostic_reports", "reviewed"],
    queryFn: query(routes.labs.diagnosticReport.list, {
      queryParams: {
        phase: "order_completed",
      },
    }),
  });

  return (
    <div className="container px-4 py-2">
      <TableAbstract
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
      />
    </div>
  );
}
