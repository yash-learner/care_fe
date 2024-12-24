import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import React from "react";
import { FaDroplet } from "react-icons/fa6";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";

import { mapKeyToBadgeVariant } from "@/Utils/badgeUtils";
import routes from "@/Utils/request/api";
import request from "@/Utils/request/request";
import useQuery from "@/Utils/request/useQuery";

import {
  ProgressBarStep,
  ServiceRequestTimeline,
} from "../Common/ServiceRequestTimeline";
import { PRIORITY_VARIANT_MAP } from "./Index";

export const CollectSpecimen: React.FC<{
  specimenId: string;
}> = ({ specimenId }) => {
  const { data, refetch } = useQuery(routes.labs.specimen.get, {
    pathParams: { id: specimenId },
  });

  const [openOrders, setOpenOrders] = React.useState<Record<string, boolean>>(
    {},
  );

  const toggleOrder = (orderId: string) => {
    setOpenOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const specimenDispatchedStatus = data?.dispatched_at
    ? "completed"
    : data?.collected_at
      ? "pending"
      : "notStarted";

  const specimenReceivedStatus = data?.received_at
    ? "completed"
    : data?.dispatched_at
      ? "pending"
      : "notStarted";

  // Minimal example of steps with no sub-steps
  const steps: ProgressBarStep[] = [
    { label: "Order Placed", status: "completed" },
    {
      label: "Specimen Collection",
      status: data?.collected_at ? "completed" : "pending",
    },
    { label: "Sent to Lab", status: specimenDispatchedStatus },
    { label: "Received at Lab", status: specimenReceivedStatus },
    { label: "Test Ongoing", status: "notStarted" },
    { label: "Under Review", status: "notStarted" },
    { label: "Completed", status: "notStarted" },
  ];

  return (
    <div className="flex flex-col-reverse lg:flex-row min-h-screen">
      {/* Left - Navigation/Progress Bar */}
      <ServiceRequestTimeline steps={steps} />

      {/* Right - Main Content */}
      <main className="flex-1 p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header Section */}
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

        {/* Patient Details Section */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col md:flex-row gap-8 mb-4">
            <div>
              <p className="text-gray-600">Patient Name</p>
              <p className="font-semibold ">{data?.subject.name}</p>
            </div>
            <div>
              <p className="">UHID</p>
              <p className="font-semibold">T105690908240017</p>
            </div>
            <div>
              <p className="">{data?.subject.age ? "Age" : "YOB"}/Sex</p>
              <p className="font-semibold ">
                {data?.subject.age ?? data?.subject.year_of_birth}/
                {
                  { 1: "Male", 2: "Female", 3: "Other", 4: "Not Mentioned" }[
                    data?.subject.gender ?? 4
                  ]
                }
              </p>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <Collapsible
            open={!!openOrders[data?.id as string]}
            onOpenChange={() => toggleOrder(data?.id as string)}
          >
            <div className="relative before:content-[''] before:absolute before:top-0 before:left-0 before:h-7 before:w-1 before:bg-gray-400 before:mt-3.5 before:rounded-r-sm">
              <div
                className={`items-center px-4 py-3 border rounded-lg shadow-sm max-w-5xl mx-auto space-y-4 ${
                  openOrders[data?.id as string] ? "bg-gray-100" : " "
                } `}
              >
                <div className="flex items-center gap-4 justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Order id
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-900">
                        {data?.request.id}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-900 rounded">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">
                      Specimen to be collected:{" "}
                      <span className="font-semibold text-gray-900">
                        {data?.type.display ?? data?.type.code}
                      </span>
                    </span>
                    <div className="flex items-center gap-4">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <div className="">
                            {openOrders[data?.id as string] ? (
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
                    <div className="max-w-5xl bg-white shadow rounded-lg p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Left Section */}
                        <div className="w-full md:w-1/2 pl-2">
                          <h3 className="text-sm font-semibold text-gray-600">
                            Test
                          </h3>
                          <p className="font-semibold">
                            {data?.request.code.display ??
                              data?.request.code.code}
                          </p>
                        </div>

                        {/* Right Section */}
                        <div className="w-full md:w-1/2 md:border-l border-gray-300 sm:pl-4 sm:pb-4">
                          <h3 className="text-sm font-semibold text-gray-600">
                            Order Placed by
                          </h3>
                          <div className="flex gap-2">
                            <p className="text-lg font-semibold text-gray-900 mb-4">
                              {[
                                data?.request.requester?.first_name,
                                data?.request.requester?.last_name,
                              ].join(" ") ?? "NA"}
                            </p>
                            <p className="text-lg font-normal text-gray-900 mb-4">
                              {data?.request.requester?.user_type ?? "NA"}
                            </p>
                          </div>

                          <h3 className="text-sm font-semibold text-gray-600">
                            Order Date/Time
                          </h3>
                          <p className="text-lg font-semibold text-gray-900 mb-4">
                            {data?.request.authored_on ?? "NA"}
                          </p>

                          <h3 className="text-sm font-semibold text-gray-600">
                            Priority
                          </h3>
                          <Badge
                            variant={mapKeyToBadgeVariant(
                              data?.request.priority,
                              PRIORITY_VARIANT_MAP,
                            )}
                            className="capitalize"
                          >
                            {data?.request?.priority ?? "Routine"}
                          </Badge>
                        </div>
                      </div>
                      {/* Note Section */}
                      <div className="border-t border-gray-300 px-2 py-4 max-w-4xl">
                        <h3 className="text-sm font-semibold text-gray-600">
                          Note:
                        </h3>
                        <p className="text-gray-700">
                          {data?.request.note.length
                            ? data?.request.note
                                .map((note) => note.text)
                                .join(" ")
                            : "No notes added to this request"}
                        </p>
                      </div>
                    </div>

                    <div className="max-w-5xl mx-auto p-4 bg-white shadow-md rounded-lg">
                      {/* Specimen Section */}
                      <div className="flex-col justify-between items-center pb-4 mb-4 space-y-2">
                        <div className="space-y-1 w-full flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-gray-600">
                            Specimen:
                          </h3>
                          <h3 className="text-sm font-semibold text-gray-600">
                            Number of samples
                          </h3>
                        </div>

                        <div className="flex justify-between items-center gap-8">
                          <div className="flex items-center gap-2 px-2 py-2 bg-gray-100 rounded-md shadow-sm border w-full">
                            <span className="">
                              <FaDroplet />
                            </span>
                            <span className="text-gray-900 font-semibold">
                              {data?.type.display ?? data?.type.code}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className="border-[1.5px] border-gray-400"
                            >
                              <CareIcon
                                icon="l-minus"
                                className="font-medium text-lg"
                              />
                            </Button>
                            <span className="px-4 py-2 bg-gray-50 rounded-md shadow-sm border text-center">
                              1
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className="border-[1.5px] border-gray-400"
                            >
                              <CareIcon
                                icon="l-plus"
                                className="font-medium text-lg"
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-5">
                        <div className="bg-gray-50 rounded-lg">
                          <div
                            className={`items-center px-4 py-3 border-[1.5px] border-gray-300 rounded-lg shadow-sm bg-white relative before:content-[''] before:absolute before:top-3 before:left-0 before:h-6 before:w-1 mx-[2px] ${
                              data?.collected_at
                                ? "before:bg-blue-600"
                                : "before:bg-gray-400"
                            } before:rounded-r-sm`}
                          >
                            <div className="flex items-center justify-between ">
                              <h3 className="text-sm font-semibold text-gray-600">
                                {data?.type.display ?? data?.type.code}
                              </h3>
                              <span
                                className={`ml-2 px-2 py-1 text-xs font-medium  ${
                                  data?.collected_at
                                    ? "bg-blue-100 text-blue-600"
                                    : "text-orange-900 bg-orange-100"
                                } rounded`}
                              >
                                {data?.collected_at
                                  ? "Collected"
                                  : "Not Collected"}
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 px-4 py-3 bg-gray-50 space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-base font-semibold text-gray-900">
                                Barcode
                              </h3>

                              {data?.collected_at && (
                                <Button
                                  className="flex items-center justify-between gap-2 bg-white px-2 py-2 rounded-md shadow-sm"
                                  variant={"outline"}
                                  disabled
                                >
                                  <CrossCircledIcon className="h-4 w-4 text-red-600" />
                                  <span className="font-semibold text-gray-900">
                                    Remove
                                  </span>
                                </Button>
                              )}
                            </div>
                            {data?.collected_at ? (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between bg-green-50 border rounded-lg p-3">
                                  {/* Success Badge */}
                                  <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 text-sm font-medium text-green-900 border border-green-300 rounded-full bg-white">
                                      Success
                                    </span>
                                    {/* Success Message */}
                                    <span className="text-green-900 font-semibold">
                                      Barcode scanned successfully
                                    </span>
                                  </div>

                                  {/* Barcode */}
                                  <div className="flex items-center gap-2">
                                    <img
                                      src="/images/barcode.svg"
                                      alt="filter"
                                      className="w-5 h-5 text-gray-600"
                                    />
                                    <span className="text-gray-700 font-semibold">
                                      {data?.identifier ?? "Not Available"}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="items-center justify-between ">
                                    <h3 className="text-sm font-normal">
                                      Tube Type
                                    </h3>
                                    <span className="text-gray-900 font-semibold">
                                      Not Available
                                    </span>
                                  </div>
                                  <div className="items-center justify-between">
                                    <h3 className="text-sm font-normal">
                                      Test
                                    </h3>
                                    <span className="text-gray-900 font-semibold">
                                      {data?.request.code.display ??
                                        data?.request.code.code}
                                    </span>
                                  </div>
                                  <div className="items-center justify-between">
                                    <h3 className="text-sm font-normal">
                                      Collection Date/Time
                                    </h3>
                                    <span className="text-gray-900 font-semibold">
                                      {data?.collected_at ?? "Not Available"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between space-x-4 bg-gray-100">
                                <div className="bg-white w-full">
                                  <Input
                                    type="text"
                                    placeholder="Scan Barcode/Enter number"
                                    className="text-center"
                                    onKeyDown={async (e) => {
                                      if (e.key === "Enter") {
                                        const barcode = e.currentTarget.value;

                                        if (!barcode) {
                                          return;
                                        }

                                        const { res } = await request(
                                          routes.labs.specimen.collect,
                                          {
                                            pathParams: { id: specimenId },
                                            body: {
                                              identifier: barcode,
                                            },
                                          },
                                        );

                                        if (!res?.ok) {
                                          return;
                                        }

                                        refetch();
                                      }
                                    }}
                                  />
                                </div>
                                <div className="text-gray-600 text-sm">OR</div>
                                <div className="w-full">
                                  <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full"
                                    disabled
                                  >
                                    Generate Barcode
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </div>
          </Collapsible>
        </div>
      </main>
    </div>
  );
};
