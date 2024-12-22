import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableSkeletonProps {
  columns: Array<{ label: string; key: string; render_as?: string }>;
  rowCount?: number;
  hasActions?: boolean;
}

export const DataTableSkeleton: React.FC<DataTableSkeletonProps> = ({
  columns,
  rowCount = 5,
  hasActions = true,
}) => {
  return (
    <div className="overflow-x-auto w-full">
      <Table className="min-w-full border-collapse border border-gray-200">
        <TableHeader>
          <TableRow className="bg-gray-100">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
              >
                {col.label}
              </TableHead>
            ))}
            {hasActions && (
              <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Action
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, i) => (
            <TableRow key={i} className="bg-white">
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className="px-4 py-2 text-sm text-gray-600"
                >
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
              {hasActions && (
                <TableCell className="px-4 py-2 text-sm text-gray-600">
                  <Skeleton className="h-8 w-16" />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
