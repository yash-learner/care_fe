import React from "react";

import { cn } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Column {
  key: string;
  label: string;
  headerClass?: string;
}

interface ResultTableProps {
  columns: Column[];
  data: Array<{ [key: string]: React.ReactNode }>;
  isPending?: boolean;
}

const LoadingSkeleton = () => (
  <div className="w-full">
    <div className="bg-gray-100 rounded-lg">
      <div className="flex divide-x-[1.5px] divide-solid divide-gray-300">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="p-3 w-full">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
      </div>
    </div>
    {Array(3)
      .fill(0)
      .map((_, i) => (
        <div
          key={i}
          className="flex divide-x-[1.5px] divide-solid divide-gray-300"
        >
          {Array(3)
            .fill(0)
            .map((_, j) => (
              <div key={j} className="p-3 w-full">
                <div className="h-4 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
        </div>
      ))}
  </div>
);

export const ResultTable: React.FC<ResultTableProps> = ({
  columns,
  data,
  isPending,
}) => {
  if (isPending) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="overflow-x-auto w-full rounded-md border-[1.5px] border-gray-300">
      <Table className="w-full border-separate border-spacing-0 bg-white shadow-sm">
        <TableHeader className="bg-gray-100 rounded-lg">
          <TableRow className="divide-x-[1.5px] divide-solid divide-gray-300">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  "text-sm text-gray-900 capitalize",
                  col.headerClass,
                )}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {data.map((row, i) => (
            <TableRow
              key={i}
              className="divide-x-[1.5px] divide-solid divide-gray-300"
            >
              {columns.map((col) => (
                <TableCell key={col.key} className="text-sm text-gray-700">
                  {row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
