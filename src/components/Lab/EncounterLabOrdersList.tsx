import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import routes from "@/Utils/request/api";
import query from "@/Utils/request/query";
import { displayCode } from "@/Utils/utils";

type ListEncounterLabOrdersListProps = {
  encounterId: string;
};

export default function EncounterLabOrdersList({
  encounterId,
}: ListEncounterLabOrdersListProps) {
  const { data, isLoading } = useQuery({
    queryKey: [
      routes.labs.serviceRequest.list.path,
      { encounter: encounterId },
    ],
    queryFn: query(routes.labs.serviceRequest.list, {
      queryParams: {
        encounter: encounterId,
      },
    }),
  });

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
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <TableRow
                  key={index}
                  className="border-b-4 border-white bg-secondary-200 mt-2"
                >
                  <TableCell className="rounded-l-md p-4">
                    <div className="flex items-center justify-between font-medium">
                      <Skeleton className="w-96 h-4" />
                      <Separator orientation="vertical" className="h-6" />
                    </div>
                  </TableCell>

                  <TableCell className="p-4">
                    <Skeleton className="w-24 h-3.5" />
                  </TableCell>

                  <TableCell className="p-4">
                    <Skeleton className="w-24 h-3.5" />
                  </TableCell>

                  <TableCell className="rounded-r-md p-4">
                    <Skeleton className="w-24 h-3.5" />
                  </TableCell>
                </TableRow>
              ))
            : data?.results.map((request) => (
                <TableRow
                  key={request.id}
                  className="border-b-4 border-white bg-secondary-200 mt-2"
                >
                  <TableCell className="rounded-l-md p-4">
                    <div className="flex items-center justify-between font-medium">
                      {displayCode(request.code)}
                      <Separator orientation="vertical" className="h-6" />
                    </div>
                  </TableCell>

                  <TableCell className="p-4">
                    <Badge className="rounded-sm capitalize shadow-none">
                      {request.priority}
                    </Badge>
                  </TableCell>

                  {/* FIXME: Remove the hardcoded values */}

                  <TableCell className="p-4">One-time</TableCell>

                  <TableCell className="rounded-r-md p-4">
                    <Badge className="rounded-sm capitalize shadow-none">
                      Pending
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
          {!isLoading && !data?.results.length && (
            <TableRow className="border-b-4 border-white bg-secondary-200 mt-2">
              <TableCell
                className="p-4 text-center text-secondary-600 text-base"
                colSpan={4}
              >
                No lab orders found!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
