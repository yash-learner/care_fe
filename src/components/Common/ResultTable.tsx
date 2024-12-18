import React from "react";

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
  headerClass?: string; // Optional
}

interface ResultTableProps {
  columns: Column[];
  data: Array<{ [key: string]: React.ReactNode }>;
}

export const ResultTable: React.FC<ResultTableProps> = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto w-full rounded-md border-[1.5px] border-gray-300">
      <Table className="w-full border-separate border-spacing-0 bg-white shadow-sm">
        <TableHeader className="bg-gray-100 rounded-lg">
          <TableRow className="divide-x-[1.5px] divide-solid divide-gray-300">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={`${col.headerClass || "text-sm text-gray-900"}`}
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
