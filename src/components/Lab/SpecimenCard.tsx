import { CrossCircledIcon } from "@radix-ui/react-icons";
import React from "react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Specimen } from "@/types/emr/specimen";

import { getPriorityColor } from "./utils";

interface SpecimenProps {
  specimen: Specimen;
  onRemove: () => void;
  onStartProcessing: () => void;
}

export const SpecimenCard: React.FC<SpecimenProps> = ({
  specimen,
  onRemove,
  onStartProcessing,
}) => {
  return (
    <div className="space-y-4 bg-white shadow-sm rounded-sm p-4 gap-5">
      {/* Specimen ID and Status */}
      <div className="flex items-center justify-between bg-gray-50 p-2">
        <div>
          <Label className="text-normal font-medium text-gray-600">
            Specimen ID
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold leading-tight text-gray-900">
              {specimen.accession_identifier ??
                specimen.identifier ??
                specimen.id.slice(0, 8)}
            </span>
            <Badge
              variant="outline"
              className="bg-pink-100 text-pink-900 px-2 py-1 text-xs font-medium"
            >
              In Process
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={onRemove}
        >
          <CrossCircledIcon className="h-4 w-4" />
          Remove
        </Button>
      </div>

      {/* Barcode Success Message */}
      <div className="space-y-1">
        <Label className="text-sm font-normal text-gray-900">Barcode</Label>
        <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-sm font-medium text-green-900 border border-green-300 rounded-full bg-white">
              Success
            </span>
            <span className="text-green-900 font-semibold">
              Barcode Scanned Successfully
            </span>
          </div>
        </div>
      </div>

      {/* Specimen Details Grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Specimen Type */}
        <div>
          <Label className="text-sm font-medium text-gray-600">
            Specimen Type
          </Label>
          <span className="block text-gray-900 font-semibold mt-1">
            {specimen.type.display ?? specimen.type.code}
          </span>
        </div>

        {/* Date of Collection */}
        <div>
          <Label className="text-sm font-medium text-gray-600">
            Date of Collection
          </Label>
          <span className="block text-gray-900 font-semibold mt-1">
            {specimen.collected_at}
          </span>
        </div>

        {/* Patient Name & ID */}
        <div>
          <Label className="text-sm font-medium text-gray-600">
            Patient Name, ID
          </Label>
          <span className="block text-gray-900 font-semibold mt-1">
            {specimen.subject.name}
          </span>
          <span className="block text-gray-500 text-sm">T105690908240017</span>
        </div>

        {/* Order ID */}
        <div>
          <Label className="text-sm font-medium text-gray-600">Order ID</Label>
          <span className="block text-gray-900 font-semibold mt-1">
            {specimen.request.id.slice(0, 8)}
          </span>
        </div>

        {/* Tube Type */}
        <div>
          <Label className="text-sm font-medium text-gray-600">Tube Type</Label>
          <span className="block text-gray-900 font-semibold mt-1">
            Not Specified
          </span>
        </div>

        {/* Test */}
        <div>
          <Label className="text-sm font-medium text-gray-600">Test</Label>
          <span className="block text-gray-900 font-semibold mt-1">
            {specimen.request.code.display ?? specimen.request.code.code}
          </span>
        </div>

        {/* Priority */}
        <div>
          <Label className="text-sm font-medium text-gray-600">Priority</Label>
          <Badge
            className={cn(
              "capitalize text-sm font-semibold",
              getPriorityColor(specimen.request.priority),
            )}
            variant="outline"
          >
            {specimen.request.priority ?? "Routine"}
          </Badge>
        </div>
      </div>

      {/* Footer Buttons */}
      {!specimen?.processing.length && (
        <div className="flex items-center justify-end gap-4">
          <Button disabled variant="outline" size="sm" className="px-8 py-2">
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={onStartProcessing}>
            Start Processing
          </Button>
        </div>
      )}
    </div>
  );
};
