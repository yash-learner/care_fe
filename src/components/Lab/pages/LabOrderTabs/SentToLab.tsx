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
import { Specimen } from "@/types/emr/specimen";

import {
  displayServiceRequestId,
  displaySpecimenId,
  getPriorityColor,
} from "../../utils";

export default function SentToLab() {
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
      cell: ({ row }) => (
        <Badge
          className={cn(
            "capitalize text-sm font-semibold",
            getPriorityColor(row.original.request.priority),
          )}
          variant="outline"
        >
          {row.original.request.priority}
        </Badge>
      ),
    },
  ];

  const { data } = useQuery({
    queryKey: ["specimens", "sent"],
    queryFn: query(routes.labs.specimen.list, {
      queryParams: {
        phase: "sent",
      },
    }),
  });

  return (
    <div className="container px-4 py-2 space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => navigate(`/lab_orders/receive_at_lab`)}
          variant="primary"
        >
          {t("receive_at_lab")}
        </Button>
      </div>
      <TableAbstract columns={columns} data={data?.results ?? []} />
    </div>
  );
}
