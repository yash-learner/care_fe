import React from "react";

import { DataTable } from "@/components/LabTest/DataTable";

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

  const data = [
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
      status: "Pending",
    },
  ];

  const handleAction = (row: Record<string, any>) => {
    alert(`Collect Specimen for ${row.orderId}`);
  };

  return (
    <div className="p-4">
      <DataTable
        columns={columns}
        data={data}
        actions={(row) => (
          <button
            onClick={() => handleAction(row)}
            className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Collect Specimen
          </button>
        )}
      />
    </div>
  );
};
