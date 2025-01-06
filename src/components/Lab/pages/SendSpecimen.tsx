import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";

import { Specimen } from "@/types/emr/specimen";

import { SendSpecimenForm } from "../SendSpecimenForm";
import { ServiceRequestCard } from "../ServiceRequestCard";

export default function SendSpecimen() {
  const [specimens, setSpecimen] = useState<Specimen[]>([]);

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-5">
      <Button
        variant="outline"
        onClick={() => {
          history.back();
        }}
        className="w-fit"
      >
        Back
      </Button>
      <h2 className="text-2xl leading-tight">Send Collected Specimen to Lab</h2>
      <div className="flex flex-col bg-white shadow-sm rounded-sm p-4 gap-5">
        <SendSpecimenForm
          onSuccess={(createdSpecimen) =>
            setSpecimen([createdSpecimen, ...specimens])
          }
        />
      </div>
      <div>
        <Label className="text-xl font-medium text-gray-900">
          Ready for Dispatch
        </Label>

        <div className="flex flex-col gap-4 mt-6">
          {specimens.map((specimen) => (
            <SpecimenCollapsible key={specimen.id} specimen={specimen} />
          ))}
        </div>
      </div>
    </div>
  );
}

const SpecimenCollapsible = ({ specimen }: { specimen: Specimen }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative before:content-[''] before:absolute before:top-0 before:left-0 before:h-7 before:w-1 before:bg-gray-400 before:mt-3.5 before:rounded-r-sm">
        <div
          className={`items-center px-4 py-3 border rounded-lg shadow-sm max-w-5xl mx-auto space-y-4 ${
            isOpen ? "bg-gray-100" : " "
          } `}
        >
          <div className="flex items-center gap-4 justify-between">
            <div>
              <span className="text-sm font-medium text-gray-600">
                Specimen id
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">
                  {specimen.identifier ?? specimen.id.slice(0, 8)}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-900 rounded">
                  Ready for Dispatch
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-4">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <div>
                      {isOpen ? (
                        <ChevronUpIcon className="h-6 w-8" />
                      ) : (
                        <ChevronDownIcon className="h-6 w-8" />
                      )}
                    </div>
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          <CollapsibleContent>
            <ServiceRequestCard serviceRequest={specimen.request} />
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  );
};
