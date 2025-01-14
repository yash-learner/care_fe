import React from "react";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { displayCode, formatDateTime } from "@/Utils/utils";
import { Specimen } from "@/types/emr/specimen";

import { displaySpecimenId } from "./utils";

interface ReceiveSpecimenCardProps {
  specimen: Specimen;
}

export const ReceiveSpecimenCard: React.FC<ReceiveSpecimenCardProps> = ({
  specimen,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-green-50 rounded-md">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-sm font-medium text-green-900 border border-green-300 rounded-full bg-white">
            Success
          </span>
          <span className="text-green-900 font-semibold">
            Barcode Scanned Successfully
          </span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 bg-white">
        <div>
          <h3 className="text-sm font-medium text-gray-600">Specimen id</h3>
          <p className="text-base font-semibold text-gray-900">
            {displaySpecimenId(specimen)}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-600">Specimen type</h3>
          <p className="text-base font-semibold text-gray-900">
            {displayCode(specimen.type)}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-600">
            Date of collection
          </h3>
          <p className="text-base font-semibold text-gray-900">
            {formatDateTime(specimen.collected_at)}
          </p>
        </div>

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

        <div>
          <h3 className="text-sm font-medium text-gray-600">Order ID</h3>
          <p className="text-base font-semibold text-gray-900">
            {specimen.request.id.slice(0, 8)}
          </p>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-md">
        <div className="mt-4 bg-gray-50 rounded-sm p-4 flex flex-col gap-4">
          <div className="rounded-md space-y-4">
            <div className="flex space-x-8">
              <div>
                <h3 className="text-sm font-normal text-gray-600">Test</h3>
                <p className="text-base font-medium text-gray-900">
                  {specimen.type.display ?? specimen.type.code}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-normal text-gray-600">Tube Type</h3>
                <p className="text-base font-medium text-gray-900">
                  Not Specified
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex-shrink-0 p-2 bg-blue-100 rounded-md">
                <CareIcon
                  icon="l-info-circle"
                  className="h-6 w-6 text-blue-600"
                />
              </div>
              <p className="ml-4 text-sm font-medium text-blue-800">
                {specimen.request?.note || "No note provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
