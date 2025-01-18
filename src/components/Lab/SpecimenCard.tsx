import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import routes from "@/Utils/request/api";
import mutate from "@/Utils/request/mutate";
import {
  displayCode,
  displayPatientId,
  displayPatientName,
  formatDateTime,
} from "@/Utils/utils";
import { Specimen } from "@/types/emr/specimen";

import { getPriorityColor } from "./utils";
import {
  displayPriority,
  displayServiceRequestId,
  displaySpecimenId,
} from "./utils";

interface SpecimenProps {
  specimen: Specimen;
  onRemove: () => void;
  onStartProcessing: (updatedSpecimen: Specimen) => void;
}

export const SpecimenCard: React.FC<SpecimenProps> = ({
  specimen,
  onRemove,
  onStartProcessing,
}) => {
  const { t } = useTranslation();
  const { mutate: startProcessing, isPending } = useMutation({
    mutationFn: mutate(routes.labs.specimen.process, {
      pathParams: { id: specimen.id },
    }),
    onSuccess: (data: Specimen) => {
      onStartProcessing(data);
      toast.success(t("processing_started_successfully"));
    },
    onError: () => {
      toast.error(t("failed_to_start_processing"));
    },
  });

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
              {displaySpecimenId(specimen)}
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

      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">
            Specimen Type
          </Label>
          <span className="block text-gray-900 font-semibold mt-1">
            {displayCode(specimen.type)}
          </span>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">
            Date of Collection
          </Label>
          <span className="block text-gray-900 font-semibold mt-1">
            {formatDateTime(specimen?.collected_at)}
          </span>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">
            Patient Name, ID
          </Label>
          <span className="block text-gray-900 font-semibold mt-1 capitalize">
            {displayPatientName(specimen.subject)}
          </span>
          <span className="block text-gray-500 text-sm">
            {displayPatientId(specimen.subject)}
          </span>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">Order ID</Label>
          <span className="block text-gray-900 font-semibold mt-1">
            {displayServiceRequestId(specimen.request)}
          </span>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">Tube Type</Label>
          <span className="block text-gray-900 font-semibold mt-1">
            Not Specified
          </span>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">Test</Label>
          <span className="block text-gray-900 font-semibold mt-1">
            {displayCode(specimen.request.code)}
          </span>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">Priority</Label>
          <Badge
            className={cn(
              "capitalize text-sm font-semibold",
              getPriorityColor(specimen.request.priority),
            )}
            variant="outline"
          >
            {displayPriority(specimen.request.priority)}
          </Badge>
        </div>
      </div>

      {!specimen?.processing.length && (
        <div className="flex items-center justify-end gap-4">
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              startProcessing({
                process: [
                  {
                    description:
                      "This step is an internal indication of status change from received to processing",
                    method: {
                      system: "http://snomed.info/sct",
                      code: "56245008",
                    },
                  },
                ],
              })
            }
            disabled={isPending}
          >
            {isPending ? (
              <>
                <CareIcon
                  icon="l-spinner"
                  className="mr-2 h-4 w-4 animate-spin"
                />
                Processing...
              </>
            ) : (
              t("start_processing")
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
