import {
  ArrowRightIcon,
  CheckCircledIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import { t } from "i18next";
import { Link, usePath } from "raviger";
import React, { useState } from "react";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";

import { ResultTable } from "@/components/Common/ResultTable";

import routes from "@/Utils/request/api";
import request from "@/Utils/request/request";
import useQuery from "@/Utils/request/useQuery";
import { formatDateTime } from "@/Utils/utils";

import {
  ProgressBarStep,
  ServiceRequestTimeline,
} from "../../Common/ServiceRequestTimeline";
import { Badge } from "../../ui/badge";
import { ConsolidatedResults } from "../ConsolidatedResults";
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

export const ReviewResult: React.FC<{
  diagnosticReportId: string;
}> = ({ diagnosticReportId }) => {
  const [open, setOpen] = useState(false);
  const [conclusion, setConclusion] = useState("");
  const path = usePath() ?? "";

  const {
    data: diagnosticReport,
    refetch,
    loading: isLoading,
  } = useQuery(routes.labs.diagnosticReport.get, {
    pathParams: {
      id: diagnosticReportId,
    },
  });

  const resultsData =
    diagnosticReport?.result.map((observation) => ({
      parameter: observation.main_code?.display ?? observation.main_code?.code,
      result: observation.value.value,
      unit: "x10³/μL", // observation.reference_range?.unit, Replace with actual unit if available
      referenceRange: "4.0 - 11.0", // Replace with actual reference range if available
      remark: "Dummy Note",
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
    diagnosticReport?.status === "preliminary" || "final"
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
          <h2 className="text-2xl leading-tight">
            {path.includes("/result") ? t("results") : t("review_result")}
          </h2>
          <div className="space-x-4 flex mt-4 lg:mt-0">
            <Button variant="secondary" className="flex items-center gap-1">
              Next Order
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Patient Details Section */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col md:flex-row gap-8 mb-4">
            <div>
              <p className="text-gray-600">Patient Name</p>
              <p className="font-semibold ">{diagnosticReport?.subject.name}</p>
            </div>
            <div>
              <p className="">UHID</p>
              <p className="font-semibold">T105690908240017</p>
            </div>
            <div>
              <p className="">
                {diagnosticReport?.subject.age ? "Age" : "YOB"}/Sex
              </p>
              <p className="font-semibold ">
                {diagnosticReport?.subject.age ??
                  diagnosticReport?.subject.year_of_birth}
                /
                {
                  {
                    male: "Male",
                    female: "Female",
                    non_binary: "Non-Binary",
                    transgender: "Transgender",
                    notMentioned: "Not Mentioned",
                  }[diagnosticReport?.subject.gender || "notMentioned"]
                }
              </p>
            </div>
          </div>
          <div>
            <Link
              href={`/patients/${diagnosticReport?.subject.id}`}
              className="text-blue-700"
            >
              Patient Health Profile
            </Link>
          </div>
        </div>
        {path.includes("/result") &&
          diagnosticReport?.conclusion === "final" && (
            <ConsolidatedResults
              orderId={diagnosticReport?.based_on.id.slice(0, 8)}
              columns={columns}
              resultsData={resultsData}
            />
          )}

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

                {/* Expanded Content */}
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
                            Note
                          </h3>
                          {diagnosticReport?.conclusion ? (
                            <p className="text-sm text-gray-800">
                              {diagnosticReport?.conclusion}
                            </p>
                          ) : (
                            <Textarea
                              value={conclusion}
                              onChange={(e) =>
                                setConclusion(e.currentTarget.value)
                              }
                              placeholder="Type your notes"
                              className="bg-white border border-gray-300 rounded-sm"
                            />
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
                        {!diagnosticReport?.conclusion && (
                          <div className="flex gap-2 justify-end p-4">
                            <Button
                              variant="link"
                              disabled
                              size="sm"
                              className="border-gray-300 font-medium gap-2"
                            >
                              <CareIcon icon="l-sync" className="size-4" />
                              <span>Re-run Tests</span>
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              className="gap-2"
                              onClick={async () => {
                                const { res, data } = await request(
                                  routes.labs.diagnosticReport.review,
                                  {
                                    pathParams: {
                                      id: diagnosticReportId,
                                    },
                                    body: {
                                      is_approved: true,
                                      conclusion,
                                    },
                                  },
                                );

                                if (!res?.ok || !data) {
                                  return;
                                }

                                refetch();
                              }}
                            >
                              <CheckCircledIcon className="h-4 w-4 text-white" />
                              Approve Results
                            </Button>
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
