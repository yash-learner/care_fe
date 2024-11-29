import React, { useState } from "react";

import { DataTable } from "@/components/LabTest/DataTable";
import TableFilter, { Filter } from "@/components/LabTest/TableFilter";

export const OrderPlaced: React.FC = () => {
  const columns = [
    { label: "Specimen ID", key: "specimenId" },
    { label: "Order ID", key: "orderId" },
    { label: "Patient Name", key: "patientName" },
    { label: "Specimen", key: "specimen" },
    { label: "Tests", key: "tests" },
    { label: "Collector", key: "collector" },
    { label: "Status", key: "status" },
  ];

  const keys = [
    {
      label: "Specimen",
      key: "specimen",
      type: "checkbox",
      options: ["Blood", "Swab"],
      defaultOperator: "is",
      operators: ["is", "is_not"],
    },
    {
      label: "Status",
      key: "status",
      type: "checkbox",
      options: ["Pending", "Collected"],
      defaultOperator: "is",
      operators: ["is", "is_not"],
    },
    {
      label: "Order ID",
      key: "orderId",
      type: "text",
      defaultOperator: "contains",
      operators: ["contains", "is", "is_not"],
    },
  ];

  const initialData = [
    {
      specimenId: "SPEC009213",
      orderId: "CARE_LAB-001",
      patientName: "John Honai",
      specimen: "Blood",
      tests: "Complete Blood Count (CBC)",
      collector: "John Doe",
      status: "Pending",
    },
    {
      specimenId: "SPEC009412",
      orderId: "CARE_LAB-002",
      patientName: "Jane Doe",
      specimen: "Swab",
      tests: "COVID-19 PCR, Influenza Test",
      collector: "Jane Doe",
      status: "Collected",
    },
  ];

  const [data, setData] = useState(initialData);

  const handleFiltersChange = (filters: Filter[]) => {
    const filteredData = initialData.filter((row) =>
      filters.every((filter) => {
        const value = row[filter.column as keyof typeof row];
        if (filter.operator === "is") return value === filter.value;
        if (filter.operator === "is_not") return value !== filter.value;
        if (filter.operator === "contains")
          return String(value).includes(filter.value);
        return true;
      }),
    );
    setData(filteredData);
  };

  return (
    <div className="space-y-4">
      <TableFilter keys={keys} onFiltersChange={handleFiltersChange} />
      <DataTable columns={columns} data={data} />
    </div>
  );
};
