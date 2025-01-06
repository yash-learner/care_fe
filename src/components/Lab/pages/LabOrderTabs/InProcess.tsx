import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "raviger";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import TableAbstract from "@/components/Lab/pages/LabOrderTabs/TableAbstract";

import routes from "@/Utils/request/api";
import query from "@/Utils/request/query";
import { displayCode } from "@/Utils/utils";
import { Specimen } from "@/types/emr/specimen";

import { displayServiceRequestId, displaySpecimenId } from "../../utils";

export default function InProcess() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns: ColumnDef<Specimen>[] = [
    {
      accessorFn: (row) => displaySpecimenId(row),
      header: "Specimen ID",
    },
    {
      accessorFn: (row) => displayServiceRequestId(row.request),
      header: "Order ID",
    },
    {
      header: "Patient Name",
      cell: ({ row }) => (
        <div>
          <p>{row.original.subject.name}</p>
          <p className="text-sm text-gray-400">
            {row.original.subject.id?.slice(0, 8)}
          </p>
        </div>
      ),
    },
    {
      accessorFn: (row) => displayCode(row.type),
      header: "Specimen",
    },
    {
      accessorFn: (row) => displayCode(row.request.code),
      header: "Test Ordered",
    },
    {
      header: "Priority",
      cell: ({ row }) => <Badge>{row.original.request.priority}</Badge>,
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <Button
          onClick={() => navigate(`/lab_orders/${row.id}/process`)}
          variant="secondary"
        >
          {t("process")}
        </Button>
      ),
    },
  ];

  const { data } = useQuery({
    queryKey: ["specimens", "in_process"],
    queryFn: query(routes.labs.specimen.list, {
      queryParams: {
        phase: "in_process",
      },
    }),
  });

  return (
    <div className="container px-4 py-2">
      <TableAbstract columns={columns} data={data?.results ?? []} />
    </div>
  );
}
