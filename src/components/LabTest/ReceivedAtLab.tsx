import { navigate } from "raviger";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/LabTest/DataTable";
import TableFilter, { Filter } from "@/components/LabTest/TableFilter";

export const ReceivedAtLab: React.FC = () => {
  const keys = [
    {
      key: "specimenId",
      label: "Specimen ID",
      type: "text",
      operators: ["is", "is_not", "contains", "does_not_contain"],
    },
    {
      key: "orderId",
      label: "Order ID",
      type: "text",
      operators: ["is", "is_not", "contains", "does_not_contain"],
    },
    {
      key: "patientName",
      label: "Patient Name",
      type: "text",
      operators: ["is", "is_not", "contains", "does_not_contain"],
    },
    {
      key: "specimen",
      label: "Specimen",
      type: "checkbox",
      options: ["Blood", "Swab", "Tissue"],
      operators: ["is", "is_not"],
    },
    {
      key: "tests",
      label: "Tests",
      type: "text",
      operators: ["is", "contains", "does_not_contain"],
    },
    {
      key: "collector",
      label: "Collector",
      type: "text",
      operators: ["is", "is_not", "contains"],
    },
    {
      key: "status",
      label: "Status",
      type: "checkbox",
      options: ["Pending", "Collected", "Completed", "Cancelled"],
      operators: ["is", "is_not"],
      render_as: "badge",
    },
    {
      key: "priority",
      label: "Priority",
      type: "radio", // New filter type
      options: ["High", "Medium", "Low"],
      operators: ["is"], // Typically, only "is" makes sense for radio
      defaultOperator: "is",
    },
  ];

  // dummy data until we have API wired up
  const initialData = [
    {
      specimenId: "SPEC009213",
      orderId: "CARE_LAB-001",
      patientName: "John Honai",
      specimen: "Blood",
      tests: "Complete Blood Count (CBC)",
      collector: "John Doe",
      status: "Transit",
      priority: "High",
    },
    {
      specimenId: "SPEC009412",
      orderId: "CARE_LAB-002",
      patientName: "Jane Doe",
      specimen: "Swab",
      tests: "COVID-19 PCR, Influenza Test",
      collector: "Jane Doe",
      status: "Transit",
      priority: "Medium",
    },
    {
      specimenId: "SPEC009425",
      orderId: "CARE_LAB-003",
      patientName: "Narayani",
      specimen: "Tissue",
      tests: "Biopsy of tissue",
      collector: "Dr. Rajmohan",
      status: "Transit",
      priority: "Low",
    },
    {
      specimenId: "SPEC009876",
      orderId: "CARE_LAB-004",
      patientName: "Tintu Ukken",
      specimen: "Swab",
      tests: "COVID-19 PCR",
      collector: "Jeena Mathew",
      status: "Transit",
      priority: "High",
    },
    {
      specimenId: "SPEC001234",
      orderId: "CARE_LAB-005",
      patientName: "Paul Varghese",
      specimen: "Blood",
      tests: "Lipid Profile",
      collector: "John Doe",
      status: "Transit",
      priority: "Medium",
    },
  ];

  const [data, setData] = useState(initialData);

  // Remove this function and use the actual API call to fetch data
  const handleFiltersChange = (appliedFilters: Filter[]) => {
    const filteredData = initialData.filter((row) =>
      appliedFilters.every((filter) => {
        const columnKey = filter.column as keyof typeof row;
        const value = row[columnKey];

        if (Array.isArray(filter.value)) {
          if (filter.operator === "is any of") {
            return filter.value.includes(value);
          }
        } else {
          if (filter.operator === "is") return value === filter.value;
          if (filter.operator === "is_not") return value !== filter.value;
          if (filter.operator === "contains")
            return (
              typeof value === "string" &&
              value.toLowerCase().includes(filter.value.toLowerCase())
            );
          if (filter.operator === "does_not_contain")
            return (
              typeof value === "string" &&
              !value.toLowerCase().includes(filter.value.toLowerCase())
            );
          if (filter.operator === "is_empty") return !value;
          if (filter.operator === "is_not_empty") return !!value;
        }
        return true;
      }),
    );

    setData(filteredData);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Table Filter */}
      <div className="flex justify-between">
        <TableFilter keys={keys} onFiltersChange={handleFiltersChange} />

        <Button
          onClick={() => navigate(`/lab_tests/receive_at_lab`)}
          variant={"primary"}
        >
          Receive at Lab
        </Button>
      </div>
      {/* Data Table */}
      <DataTable
        columns={keys.map((key) => ({
          label: key.label,
          key: key.key,
          render_as: key.render_as,
        }))}
        data={data}
      />
    </div>
  );
};
