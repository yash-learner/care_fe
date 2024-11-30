import React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps {
  columns: Array<{ label: string; key: string; render_as?: string }>;
  data: Array<Record<string, any>>;
  actions?: (row: Record<string, any>) => React.ReactNode;
}

const badgeStyles: Record<string, string> = {
  pending: "bg-orange-100 text-orange-800",
  collected: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  default: "bg-gray-100 text-gray-800",
};

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  actions,
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
            {actions && (
              <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Action
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              className={`hover:bg-gray-50  ${
                index % 2 === 0 ? "bg-white" : ""
              }`}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className="px-4 py-2 text-sm text-gray-600"
                >
                  {col.render_as === "badge" ? (
                    <Badge
                      className={`bg-muted transition-none hover:bg-muted  ${badgeStyles[row[col.key].toString().toLowerCase()]}`}
                    >
                      {row[col.key]}
                    </Badge>
                  ) : (
                    row[col.key]
                  )}
                </TableCell>
              ))}
              {actions && (
                <TableCell className="px-4 py-2">{actions(row)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
