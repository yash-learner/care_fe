import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { Link } from "raviger";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";

import { ResultTable } from "@/components/Common/ResultTable";

import routes from "@/Utils/request/api";
import query from "@/Utils/request/query";
import { formatDateTime } from "@/Utils/utils";

import {
  ProgressBarStep,
  ServiceRequestTimeline,
} from "../../Common/ServiceRequestTimeline";
import { Badge } from "../../ui/badge";
import { ConsolidatedResults } from "../ConsolidatedResults";
import { PatientDetails } from "../PatientDetails";
import { ServiceRequestCard } from "../ServiceRequestCard";

const columns = [
  {
    key: "parameter",
    label: "Parameter",
  },
  { key: "result", label: "Result" },
  { key: "unit", label: "Unit" },
  {
    key: "referenceRange",
    label: "Reference Range",
  },
  { key: "remark", label: "Remark" },
];

export const Results: React.FC<{
  diagnosticReportId: string;
}> = ({ diagnosticReportId }) => {
  const [open, setOpen] = useState(false);

  const { data: diagnosticReport, isLoading } = useQuery({
    queryKey: ["get-diagnostic-report", diagnosticReportId],
    queryFn: query(routes.labs.diagnosticReport.get, {
      pathParams: { id: diagnosticReportId },
    }),
  });

  const resultsData =
    diagnosticReport?.result.map((observation) => ({
      parameter: observation.main_code?.display ?? observation.main_code?.code,
      result: observation.value.value,
      unit: "x10³/μL", // observation.reference_range?.unit, Replace with actual unit if available
      referenceRange: "4.0 - 11.0", // Replace with actual reference range if available
      remark: observation.note,
    })) ?? [];

  const specimenDispatchedStatus = diagnosticReport?.specimen?.[0]
    ?.dispatched_at
    ? "completed"
    : diagnosticReport?.specimen?.[0].collected_at
      ? "pending"
      : "notStarted";

  const specimenReceivedStatus = diagnosticReport?.specimen?.[0].received_at
    ? "completed"
    : diagnosticReport?.specimen?.[0].dispatched_at
      ? "pending"
      : "notStarted";

  const specimenTestInProcessStatus =
    diagnosticReport?.status === "preliminary" ||
    diagnosticReport?.status === "final"
      ? "completed"
      : diagnosticReport?.specimen?.[0].received_at
        ? "pending"
        : "notStarted";

  const specimenUderReviewStatus =
    diagnosticReport?.status === "final"
      ? "completed"
      : diagnosticReport?.status === "preliminary"
        ? "pending"
        : "notStarted";

  // Todo: Should we need to consider sending the report to the patient under completion status?
  const specimenCompletedStatus =
    diagnosticReport?.status === "final" ? "completed" : "notStarted";

  // Minimal example of steps with no sub-steps
  const steps: ProgressBarStep[] = [
    { label: "Order Placed", status: "completed" },
    {
      label: "Specimen Collection",
      status: diagnosticReport?.specimen?.[0].collected_at
        ? "completed"
        : "pending",
    },
    { label: "Sent to Lab", status: specimenDispatchedStatus },
    { label: "Received at Lab", status: specimenReceivedStatus },
    { label: "Test Ongoing", status: specimenTestInProcessStatus },
    { label: "Under Review", status: specimenUderReviewStatus },
    { label: "Completed", status: specimenCompletedStatus },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col-reverse lg:flex-row min-h-screen">
        <div className="w-64 border-r">
          <Skeleton className="h-screen" />
        </div>
        <main className="flex-1 p-6 lg:p-8 max-w-5xl mx-auto">
          <Skeleton className="h-10 w-20 mb-8" />
          <div className="flex justify-between mb-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="flex justify-between mb-4">
            <div className="flex gap-8">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
            <Skeleton className="h-6 w-36" />
          </div>
          <div className="mb-4">
            <Collapsible>
              <div className="">
                <div className="px-4 py-3 border rounded-lg shadow-sm">
                  <div className="flex items-end gap-4 justify-between px-1 py-2">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            </Collapsible>
          </div>
          <div className="mb-4">
            <Collapsible>
              <div className="relative before:content-[''] before:absolute before:top-0 before:left-0 before:h-7 before:w-1 before:bg-gray-400 before:mt-3.5 before:rounded-r-sm">
                <div className="px-4 py-3 border rounded-lg shadow-sm">
                  <div className="flex items-center gap-4 justify-between mb-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              </div>
            </Collapsible>
          </div>
        </main>
      </div>
    );
  }

  // Todo: render all the recent orders of patient
  return (
    <div className="flex flex-col-reverse lg:flex-row min-h-screen">
      <ServiceRequestTimeline steps={steps} />

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
          <h2 className="text-2xl leading-tight">{t("results")}</h2>
          <div className="space-x-4 flex mt-4 lg:mt-0">
            <Button
              variant="secondary"
              className="flex items-center gap-1 border-[2px] border-gray-300"
            >
              Next Order
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {diagnosticReport?.subject && (
            <PatientDetails patient={diagnosticReport.subject} />
          )}
          <div>
            <Link
              href={`/facility/${diagnosticReport?.encounter?.facility.id}/patient/${diagnosticReport?.subject.id}/health-profile`}
              className="text-blue-700"
            >
              Patient Health Profile
            </Link>
          </div>
        </div>

        <ConsolidatedResults
          orderId={diagnosticReport?.based_on?.id?.slice(0, 8) ?? ""}
          columns={columns}
          resultsData={resultsData}
        />

        <div className="mb-4">
          <Collapsible open={open} onOpenChange={setOpen}>
            <div className="relative before:content-[''] before:absolute before:top-0 before:left-0 before:h-7 before:w-1 before:bg-gray-400 before:mt-3.5 before:rounded-r-sm">
              <div
                className={`items-center px-4 py-3 border rounded-lg shadow-sm max-w-5xl mx-auto space-y-4 ${
                  open ? "bg-gray-100" : ""
                } `}
              >
                <div className="flex items-center gap-4 justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Order id
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-900">
                        {diagnosticReport?.based_on.id.slice(0, 8)}
                      </span>
                      <Badge
                        variant="outline"
                        className={`${
                          diagnosticReport?.conclusion
                            ? "text-green-900 bg-green-100"
                            : "text-orange-900 bg-orange-100 "
                        }`}
                      >
                        {diagnosticReport?.conclusion
                          ? "Completed"
                          : "Under Review"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">
                      Specimen to be collected:{" "}
                      <span className="font-semibold text-gray-900">
                        {diagnosticReport?.specimen[0]?.type.display ??
                          diagnosticReport?.specimen[0]?.type.code}
                      </span>
                    </span>
                    <div className="flex items-center gap-4">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <div className="">
                            {open ? (
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

                <CollapsibleContent>
                  <div className="space-y-4">
                    <div className="relative">
                      {diagnosticReport && (
                        <ServiceRequestCard
                          serviceRequest={diagnosticReport.based_on}
                        />
                      )}
                      <div className="flex w-full ms-8" id="sample-actions">
                        <div className="flex flex-col">
                          <div className="flex space-x-4">
                            <div className="border-l-[2.5px] border-b-[2.5px] border-gray-300 p-4 w-5 h-16"></div>
                            <div className="relative flex justify-center items-end top-[5px] gap-2">
                              <CheckIcon className="h-4 w-4 text-white bg-green-500 rounded-full " />
                              <div className="relative flex flex-col top-5 leading-tight">
                                <div>
                                  <span className="text-sm">
                                    Specimen Collected by:
                                  </span>
                                  <span className="text-sm font-semibold ps-1">
                                    {diagnosticReport?.specimen[0]?.collected_by
                                      ?.first_name ?? "NA"}
                                  </span>
                                </div>
                                <span className="text-sm">
                                  on{" "}
                                  {formatDateTime(
                                    diagnosticReport?.specimen[0]?.collected_at,
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-4">
                            <div className="border-l-[2.5px] border-b-[2.5px] border-gray-300 p-4 w-5 h-16"></div>
                            <div className="relative flex justify-center items-end top-[5px] gap-2">
                              <CheckIcon className="h-4 w-4 text-white bg-green-500 rounded-full " />
                              <div className="relative flex flex-col top-5 leading-tight">
                                <div>
                                  <span className="text-sm">
                                    Specimen Send to lab by:
                                  </span>
                                  <span className="text-sm font-semibold ps-1">
                                    {diagnosticReport?.specimen[0]
                                      ?.dispatched_by?.first_name ?? "NA"}
                                  </span>
                                </div>
                                <span className="text-sm">
                                  on{" "}
                                  {formatDateTime(
                                    diagnosticReport?.specimen[0]
                                      ?.dispatched_at,
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-4">
                            <div className="border-l-[2.5px] border-b-[2.5px] border-gray-300 p-4 w-5 h-16"></div>
                            <div className="relative flex justify-center items-end top-[5px] gap-2">
                              <CheckIcon className="h-4 w-4 text-white bg-green-500 rounded-full " />
                              <div className="relative flex flex-col top-5 leading-tight">
                                <div>
                                  <span className="text-sm">
                                    Specimen Recieved at lab{" "}
                                    <span className="text-sm font-semibold pe-1">
                                      {diagnosticReport?.based_on.location?.slice(
                                        0,
                                        8,
                                      ) ?? "NA"}
                                    </span>
                                    by:
                                  </span>
                                  <span className="text-sm font-semibold ps-1">
                                    {diagnosticReport?.specimen[0]?.received_by
                                      ?.first_name ?? "NA"}
                                  </span>
                                </div>
                                <span className="text-sm">
                                  on{" "}
                                  {formatDateTime(
                                    diagnosticReport?.specimen[0]?.received_at,
                                  ) ?? "NA"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-4">
                            <div className="border-l-[2.5px] border-b-[2.5px] border-gray-300 p-4 w-5 h-16"></div>
                            <div className="relative flex justify-center items-end top-[5px] gap-2">
                              <CheckIcon className="h-4 w-4 text-white bg-green-500 rounded-full " />
                              <div className="relative flex flex-col top-5 leading-tight">
                                <div>
                                  <span className="text-sm">
                                    Test conducted and results entered by:
                                  </span>
                                  <span className="text-sm font-semibold ps-1">
                                    {diagnosticReport?.performer?.first_name ??
                                      "NA"}
                                  </span>
                                </div>
                                <span className="text-sm">
                                  on{" "}
                                  {formatDateTime(diagnosticReport?.issued) ??
                                    "NA"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="border-l-[2.5px] border-gray-300 p-4 h-10"></div>
                        </div>
                      </div>
                      <div
                        className="bg-gray-100 border border-solid rounded-lg shadow-md space-y-2"
                        id="test-results"
                      >
                        <h2 className="text-base font-semibold text-gray-900 px-4 py-2">
                          Test Results:
                        </h2>
                        <ResultTable columns={columns} data={resultsData} />

                        <div className="flex flex-col gap-2 p-4 bg-gray-60">
                          <h3 className="text-sm font-medium text-gray-600">
                            Conclusion Note
                          </h3>
                          {diagnosticReport?.conclusion && (
                            <p className="text-sm text-gray-800">
                              {diagnosticReport?.conclusion}
                            </p>
                          )}
                        </div>
                        {diagnosticReport?.conclusion && (
                          <div className="bg-white p-2">
                            <div className="flex items-center justify-between bg-green-50 rounded-lg px-4 py-2 shadow-sm">
                              <p className="text-sm font-medium text-green-900">
                                Results Verified by{" "}
                                {
                                  diagnosticReport.results_interpreter
                                    ?.first_name
                                }
                                , Dummy Designation
                              </p>
                              <span className="px-3 py-1 text-sm font-semibold text-green-700 bg-white rounded-full border border-green-300">
                                Verified
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {diagnosticReport?.conclusion && (
                        <div className="flex gap-4 pb-4">
                          <div className="border-l-[2.5px] border-b-[2.5px] border-gray-300 p-4 w-5 h-8 ms-8"></div>
                          <div className="flex justify-center items-end gap-2">
                            <CheckIcon className="h-4 w-4 text-white bg-green-500 rounded-full " />
                            <div className="relative flex flex-col top-5 leading-tight">
                              <div>
                                <span className="text-sm">
                                  Result verified by:
                                </span>
                                <span className="text-sm font-semibold ps-1">
                                  {diagnosticReport?.results_interpreter
                                    ?.first_name ?? "NA"}
                                  , Dummy Designation
                                </span>
                              </div>
                              <span className="text-sm">on 29 Nov 3:33 PM</span>
                            </div>
                          </div>
                        </div>
                      )}
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
