// Todo: Need to make this component more generic and reusable
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { mapKeyToBadgeVariant } from "@/Utils/badgeUtils";

import { Badge } from "../ui/badge";
import { PRIORITY_VARIANT_MAP } from "./Index";

interface DataTableProps {
  columns: Array<{ label: string; key: string; render_as?: string }>;
  data: Array<Record<string, any>>;
  actions?: (row: Record<string, any>) => React.ReactNode;
}

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
            <TableRow key={index} className="bg-white">
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className="px-4 py-2 text-sm text-gray-600"
                >
                  {col.render_as === "badge" ? (
                    // Todo: Need to make this component more generic and reusable
                    <Badge
                      variant={mapKeyToBadgeVariant(
                        row[col.key].toLowerCase(),
                        PRIORITY_VARIANT_MAP,
                      )}
                      className="rounded-sm capitalize shadow-none"
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
