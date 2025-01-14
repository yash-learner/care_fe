// TableAbstract.tsx
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TableAbstractProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  skeletonRows?: number;
};

export default function TableAbstract<TData, TValue>({
  columns,
  data,
  isLoading = false,
  skeletonRows = 5,
}: TableAbstractProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader className="bg-gray-100">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header, index) => (
              <TableHead
                key={header.id}
                className={cn(
                  index === 0 && "rounded-tl",
                  index === headerGroup.headers.length - 1 && "rounded-tr",
                )}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <div className="h-1" />

      <TableBody className="bg-white">
        {isLoading ? (
          // Render skeleton rows
          Array.from({ length: skeletonRows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((_, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={cn(
                    colIndex === 0 && "rounded-bl",
                    colIndex === columns.length - 1 && "rounded-br",
                  )}
                >
                  <Skeleton className="w-full h-4" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : table.getRowModel().rows.length ? (
          // Render actual data rows
          table.getRowModel().rows.map((row, rowIndex) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell, cellIndex) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    "align-top",
                    rowIndex === 0 && cellIndex === 0 && "rounded-tl",
                    rowIndex === 0 &&
                      cellIndex === row.getVisibleCells().length - 1 &&
                      "rounded-tr",
                    rowIndex === table.getRowModel().rows.length - 1 &&
                      cellIndex === 0 &&
                      "rounded-bl",
                    rowIndex === table.getRowModel().rows.length - 1 &&
                      cellIndex === row.getVisibleCells().length - 1 &&
                      "rounded-br",
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center rounded"
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
