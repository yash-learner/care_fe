import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";

import routes from "@/Utils/request/api";
import mutate from "@/Utils/request/mutate";
import request from "@/Utils/request/request";
import { CodeableConcept } from "@/types/emr/base";
import { Specimen } from "@/types/emr/specimen";

import { BarcodeInput } from "../BarcodeInput";
import {
  ReceiveSpecimenForm,
  SpecimenIntegrityFormData,
} from "../ReceiveSpecimenForm";
import { ReceiveSpecimenCard } from "../ReceivedSpecimenCard";
import { SpecimenInfoCard } from "../SpecimenInfoCard";

export const ReceiveSpecimen: React.FC = () => {
  const [scannedSpecimen, setScannedSpecimen] = React.useState<Specimen>();
  const [approvedSpecimens, setApprovedSpecimens] = React.useState<Specimen[]>(
    [],
  );

  const { mutate: receiveAtLab, isPending } = useMutation({
    mutationFn: mutate(routes.labs.specimen.ReceiveAtLab, {
      pathParams: {
        id: scannedSpecimen?.id ?? "",
      },
    }),
    onSuccess: (data: Specimen) => {
      setApprovedSpecimens((prev) => [...prev, data]);
      setScannedSpecimen(undefined);
    },
    onError: (err: any) => {
      console.error("Error receiving specimen:", err);
    },
  });

  const CONDITION_CODE_SYSTEM = "http://terminology.hl7.org/CodeSystem/v2-0493";

  const specimenConditionMap: Record<
    string,
    { code: string; display: string }
  > = {
    Autolyzed: { code: "AUT", display: "Autolyzed" },
    Clotted: { code: "CLOT", display: "Clotted" },
    Contaminated: { code: "CON", display: "Contaminated" },
    Cool: { code: "COOL", display: "Cool" },
    Frozen: { code: "FROZ", display: "Frozen" },
    Hemolyzed: { code: "HEM", display: "Hemolyzed" },
    Live: { code: "LIVE", display: "Live" },
    "Room temperature": { code: "ROOM", display: "Room temperature" },
    "Sample not received": { code: "SNR", display: "Sample not received" },
    Centrifuged: { code: "CFU", display: "Centrifuged" },
  };
  function createSpecimenConditionArray(
    formData: SpecimenIntegrityFormData,
  ): CodeableConcept[] {
    const condition: CodeableConcept[] = [];

    for (const [param, paramData] of Object.entries(formData.parameters)) {
      if (paramData.value === "Yes") {
        const { code, display } = specimenConditionMap[param] ?? {};
        if (!code) continue;

        condition.push({
          coding: [
            {
              system: CONDITION_CODE_SYSTEM,
              code,
              display,
            },
          ],
          text: paramData.note,
        });
      }
    }

    return condition;
  }

  const onSubmit = (data: SpecimenIntegrityFormData) => {
    const newConditions = createSpecimenConditionArray(data);

    receiveAtLab({
      note: data.additionalNote,
      condition: newConditions,
    });
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-5 py-1">
      <Button
        variant="outline"
        onClick={() => {
          history.back();
        }}
        className="w-fit"
      >
        Back
      </Button>
      <h2 className="text-2xl leading-tight">Receive Specimen at Lab</h2>
      <div className="flex flex-col bg-white shadow-sm rounded-sm p-4 gap-5">
        {scannedSpecimen ? (
          <div className="space-y-4">
            <ReceiveSpecimenCard specimen={scannedSpecimen} />
            <div className="mt-4 bg-white rounded-md">
              <div className="mt-4 bg-gray-50 rounded-sm p-4 flex flex-col gap-4">
                <ReceiveSpecimenForm
                  onSubmit={onSubmit}
                  acceptSpecimen={isPending}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label className="text-sm font-normal text-gray-900">Barcode</Label>
            <BarcodeInput
              className="text-center"
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  const barcode = e.currentTarget.value;

                  const { res, data } = await request(
                    routes.labs.specimen.get,
                    {
                      pathParams: {
                        id: barcode,
                      },
                    },
                  );

                  if (!res?.ok || !data) {
                    return;
                  }

                  setScannedSpecimen(data);
                }
              }}
            />
          </div>
        )}
      </div>

      <div>
        <Label className="text-xl font-medium text-gray-900">
          Received at Lab
        </Label>
        <div className="flex flex-col gap-4 mt-6">
          {approvedSpecimens.map((specimen) => (
            <ReceiveSpecimenCollapsible key={specimen.id} specimen={specimen} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ReceiveSpecimenCollapsible: React.FC<{
  specimen: Specimen;
}> = ({ specimen }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative before:content-[''] before:absolute before:top-0 before:left-0 before:h-7 before:w-1 before:bg-gray-400 before:mt-3.5 before:rounded-r-sm">
        <div
          className={`items-center px-4 py-3 border rounded-lg shadow-sm max-w-5xl mx-auto space-y-4`}
        >
          <div className="flex items-center gap-4 justify-between">
            <div>
              <span className="text-sm font-medium text-gray-600">
                Specimen id
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">
                  {specimen.identifier ?? specimen.id}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-pink-100 text-pink-900 rounded">
                  Received at Lab
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-4">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isOpen ? (
                      <ChevronUpIcon className="h-6 w-8" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-8" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
          </div>
          <CollapsibleContent>
            <SpecimenInfoCard specimen={specimen} />
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  );
};
