import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps {
  columns: Array<{ label: string; key: string }>;
  data: Array<Record<string, any>>;
  actions?: (row: Record<string, any>) => React.ReactNode;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  actions,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key}>{col.label}</TableHead>
          ))}
          {actions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            {columns.map((col) => (
              <TableCell key={col.key}>{row[col.key]}</TableCell>
            ))}
            {actions && <TableCell>{actions(row)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
