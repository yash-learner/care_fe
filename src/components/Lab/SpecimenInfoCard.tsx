import dayjs from "dayjs";
import React from "react";

import {
  displayCode,
  displayPatientId,
  displayPatientName,
} from "@/Utils/utils";
import { Specimen } from "@/types/emr/specimen";

import { Card, CardContent } from "../ui/card";
import { displayServiceRequestId } from "./utils";

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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white">
          <div>
            <h3 className="text-sm font-medium text-gray-600">
              Patient Name, ID
            </h3>
            <p className="text-base font-semibold text-gray-900">
              {displayPatientName(specimen.subject)}
            </p>
            <p className="text-sm text-gray-600">
              {displayPatientId(specimen.subject)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600">Order ID</h3>
            <p className="text-base font-semibold text-gray-900">
              {displayServiceRequestId(specimen.request)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600">Specimen Type</h3>
            <p className="text-base font-semibold text-gray-900">
              {displayCode(specimen.type)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600">
              Date of Collection
            </h3>
            <p className="text-base font-semibold text-gray-900">
              {dayjs(specimen.collected_at).format("MMMM D, YYYY")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600">
              Days Since Collection
            </h3>
            <p className="text-base font-semibold text-gray-900">
              {daysSinceCollection}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-600">Notes:</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {specimen.request?.note || "No note provided for the lab order"}
            <br />
            <br />
            {specimen.note || ""}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
