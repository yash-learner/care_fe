import { mapKeyToBadgeVariant } from "@/Utils/badgeUtils";
import routes from "@/Utils/request/api";
import useQuery from "@/Utils/request/useQuery";

import { Badge } from "../ui/badge";
import { BadgeProps } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type ListEncounterServiceRequestsProps = {
  encounterId: string;
};

export default function ListEncounterServiceRequests({
  encounterId,
}: ListEncounterServiceRequestsProps) {
  const { data } = useQuery(routes.labs.serviceRequest.list, {
    query: {
      encounter: encounterId,
    },
  });

  // TODO: Add Loader while fetching data

  const priorityVariantMap: Record<string, BadgeProps["variant"]> = {
    routine: "default",
    asap: "warning",
    urgent: "secondary",
    stat: "destructive",
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="border-none">
            <TableHead>Test</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Reccurrence</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.results.map((request) => (
            <TableRow
              key={request.id}
              className="border-b-4 border-white bg-secondary-200 mt-2"
            >
              <TableCell className="rounded-l-md p-4">
                <div className="flex items-center justify-between font-medium">
                  {request.code.display}
                  <Separator orientation="vertical" className="h-6" />
                </div>
              </TableCell>

              <TableCell className="p-4">
                <Badge
                  variant={mapKeyToBadgeVariant(
                    request.priority?.toLowerCase(),
                    priorityVariantMap,
                  )}
                >
                  {request.priority || "Routine"}
                </Badge>
              </TableCell>

              <TableCell className="p-4">One-time</TableCell>

              <TableCell className="rounded-r-md p-4">
                <Badge className="bg-yellow-600">Pending</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
