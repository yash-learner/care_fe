import dayjs from "dayjs";
import React from "react";

import { Specimen } from "@/types/emr/specimen";

import { Card, CardContent } from "../ui/card";

interface SpecimenInfoCardProps {
  specimen: Specimen;
}

export const SpecimenInfoCard: React.FC<SpecimenInfoCardProps> = ({
  specimen,
}) => {
  const daysSinceCollection = dayjs().diff(dayjs(specimen.collected_at), "day");

  return (
    <Card>
      <CardContent className="p-6">
        {/* Main Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white">
          {/* Patient Name & ID */}
          <div>
            <h3 className="text-sm font-medium text-gray-600">
              Patient Name, ID
            </h3>
            <p className="text-base font-semibold text-gray-900">
              {specimen.subject.name}
            </p>
            <p className="text-sm text-gray-600">
              {specimen.subject.id || "T105690908240017"}
            </p>
          </div>

          {/* Order ID */}
          <div>
            <h3 className="text-sm font-medium text-gray-600">Order ID</h3>
            <p className="text-base font-semibold text-gray-900">
              {specimen.request?.id ? specimen.request.id.slice(0, 8) : "N/A"}
            </p>
          </div>

          {/* Specimen Type */}
          <div>
            <h3 className="text-sm font-medium text-gray-600">Specimen Type</h3>
            <p className="text-base font-semibold text-gray-900">
              {specimen.type.display || specimen.type.code || "N/A"}
            </p>
          </div>

          {/* Date of Collection */}
          <div>
            <h3 className="text-sm font-medium text-gray-600">
              Date of Collection
            </h3>
            <p className="text-base font-semibold text-gray-900">
              {dayjs(specimen.collected_at).format("MMMM D, YYYY")}
            </p>
          </div>

          {/* Days Since Collection */}
          <div>
            <h3 className="text-sm font-medium text-gray-600">
              Days Since Collection
            </h3>
            <p className="text-base font-semibold text-gray-900">
              {daysSinceCollection}
            </p>
          </div>
        </div>

        {/* Note Section */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-600">Notes:</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {specimen.request?.note || "No note provided for the lab order"}
            <br />
            <br />
            {specimen.note || "No note provided"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
