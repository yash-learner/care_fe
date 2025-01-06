import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import routes from "@/Utils/request/api";
import query from "@/Utils/request/query";
import { formatPatientAge } from "@/Utils/utils";
import { ServiceRequest } from "@/types/emr/serviceRequest";

import { CollectSpecimenFormCard } from "../CollectSpecimenFormCard";
import { ServiceRequestCard } from "../ServiceRequestCard";
import { displayServiceRequestId } from "../utils";

export const CollectSpecimen: React.FC<{
  encounterId: string;
}> = ({ encounterId }) => {
  const { data: labOrdersResponse } = useQuery({
    queryKey: ["lab_orders", encounterId],
    queryFn: query(routes.labs.serviceRequest.list, {
      queryParams: {
        encounter: encounterId,
      },
    }),
  });

  const patient = useMemo(() => {
    return labOrdersResponse?.results[0].subject;
  }, [labOrdersResponse]);

  return (
    <div className="flex flex-col-reverse lg:flex-row min-h-screen">
      <div>hello there</div>

      <main className="flex-1 p-6 lg:p-8 max-w-5xl mx-auto">
        <Button
          variant="outline"
          onClick={() => {
            history.back();
          }}
        >
          Back
        </Button>

        <div className="flex flex-col lg:flex-row items-center justify-between mb-8 mt-4">
          <h2 className="text-2xl leading-tight">Collect Specimen</h2>
          <div className="space-x-4 flex mt-4 lg:mt-0">
            <Button variant={"link"}>Specimen Collected</Button>
            <Button
              variant="secondary"
              className="flex items-center gap-1 border-[2px] border-gray-300"
            >
              Next Patient
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col md:flex-row gap-8 mb-4">
            <div>
              <p className="text-gray-600">Patient Name</p>
              <p className="font-semibold ">{patient?.name}</p>
            </div>
            <div>
              <p className="">Phone Number</p>
              <p className="font-semibold">{patient?.phone_number}</p>
            </div>
            <div>
              <p className="">Age / Sex</p>
              <p className="font-semibold capitalize">
                {formatPatientAge(patient, true)} / {patient?.gender}
              </p>
            </div>
          </div>
        </div>
        <div className="mb-4 space-y-4">
          {labOrdersResponse?.results.map((labOrder) => (
            <LabOrderCollapsible key={labOrder.id} labOrder={labOrder} />
          ))}
        </div>
      </main>
    </div>
  );
};

const LabOrderCollapsible: React.FC<{
  labOrder: ServiceRequest;
}> = ({ labOrder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: specimenResponse } = useQuery({
    queryKey: ["specimen", labOrder.id],
    queryFn: query(routes.labs.specimen.list, {
      queryParams: {
        request: labOrder.id,
      },
    }),
  });

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
                Order id
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">
                  {displayServiceRequestId(labOrder)}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-900 rounded capitalize">
                  {labOrder.status}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600">
                Specimen to be collected:{" "}
                <span className="font-semibold text-gray-900">Blood</span>
              </span>
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
            <div className="space-y-4">
              <ServiceRequestCard serviceRequest={labOrder} />
              {specimenResponse?.results.map((specimen) => (
                <CollectSpecimenFormCard specimen={specimen} />
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  );
};
