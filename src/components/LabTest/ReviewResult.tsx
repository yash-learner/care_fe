import {
  ArrowRightIcon,
  CheckCircledIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import { Link } from "raviger";
import React, { useState } from "react";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

import routes from "@/Utils/request/api";
import request from "@/Utils/request/request";
import useQuery from "@/Utils/request/useQuery";

export const ReviewResult: React.FC<{
  diagnosticReportId: string;
}> = ({ diagnosticReportId }) => {
  const [open, setOpen] = useState(true);
  const [conclusion, setConclusion] = useState("");

  const { data: diagnosticReport, refetch } = useQuery(
    routes.labs.diagnosticReport.get,
    {
      pathParams: {
        id: diagnosticReportId,
      },
    },
  );

  return (
    <div className="flex flex-col-reverse lg:flex-row min-h-screen">
      {/* Left - Navigation/Progress Bar */}
      <nav className="w-full lg:max-w-xs bg-gray-100 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
        <ul className="relative">
          {/* Order Placed */}
          <li className="flex gap-2 before:content-[''] before:block before:h-20">
            <div className="relative last:after:hidden after:absolute after:top-4 after:bottom-0 after:left-[7px] after:w-0.5 after:bg-gray-300 ">
              {/* <div className="relative z-10 h-4 w-4 rounded-full bg-green-600"> */}
              <CheckIcon className="relative z-10 h-4 w-4 rounded-full bg-green-600 text-white" />
              {/* </div> */}
            </div>
            <div className="flex flex-col gap-2 pb-4">
              <span className="text-green-600">Order Placed</span>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">
                  Order 1: CARE_LAB_001
                </span>
                <span className="text-gray-500 text-sm">
                  Order 2: CARE_LAB_002
                </span>
              </div>
            </div>
          </li>

          {/* Specimen Collection */}
          <li className="flex gap-2 before:content-[''] before:block before:h-20">
            <div className="relative last:after:hidden after:absolute after:top-0 after:bottom-0 after:left-[7px] after:w-0.5 after:bg-gray-300 ">
              <img
                src="/images/clock_history.svg"
                className="w-4 h-4 z-10 relative text-base"
              />
            </div>
            <div className="flex flex-col gap-2 pb-4">
              <span className="text-blue-600">Specimen Collection</span>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">
                  Order 1: Collected
                </span>
                <span className="text-gray-500 text-sm">Order 2: Pending</span>
              </div>
            </div>
          </li>

          {/* Sent to Lab */}
          <li className="flex gap-2 before:content-[''] before:block before:h-20">
            <div className="relative last:after:hidden after:absolute after:top-0 after:bottom-0 after:left-[7px] after:w-0.5 after:bg-gray-300">
              <div className="relative z-10 h-4 w-4 rounded-full bg-gray-300"></div>
            </div>
            <div className="flex flex-col gap-2 pb-4">
              <span className="text-gray-600">Sent to Lab</span>
            </div>
          </li>

          {/* Received at Lab */}
          <li className="flex gap-2 before:content-[''] before:block before:h-20">
            <div className="relative last:after:hidden after:absolute after:top-0 after:bottom-0 after:left-[7px] after:w-0.5 after:bg-gray-300">
              <div className="relative z-10 h-4 w-4 rounded-full bg-gray-300"></div>
            </div>
            <span className="text-gray-600">Received at Lab</span>
          </li>

          {/* Test Ongoing */}
          <li className="flex gap-2 before:content-[''] before:block before:h-20">
            <div className="relative last:after:hidden after:absolute after:top-0 after:bottom-0 after:left-[7px] after:w-0.5 after:bg-gray-300">
              <div className="relative z-10 h-4 w-4 rounded-full bg-gray-300"></div>
            </div>
            <span className="text-gray-60">Test Ongoing</span>
          </li>

          {/* Under Review */}
          <li className="flex gap-2 before:content-[''] before:block before:h-20">
            <div className="relative last:after:hidden after:absolute after:top-0 after:bottom-0 after:left-[7px] after:w-0.5 after:bg-gray-300">
              <div className="relative z-10 h-4 w-4 rounded-full bg-gray-300"></div>
            </div>
            <span className="text-gray-600">Under Review</span>
          </li>

          {/* Completed */}
          <li className="flex gap-2 before:content-[''] before:block before:h-20">
            <div className="relative z-10 h-4 w-4 rounded-full bg-gray-300"></div>
            <span className="text-gray-600">Completed</span>
          </li>
        </ul>
      </nav>

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
          <h2 className="text-2xl leading-tight">Review Result</h2>
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
                  { 1: "Male", 2: "Female", 3: "Other", 4: "Not Mentioned" }[
                    diagnosticReport?.subject.gender ?? 4
                  ]
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

        <div className="mb-4">
          <Collapsible open={open} onOpenChange={setOpen}>
            <div className="relative before:content-[''] before:absolute before:top-0 before:left-0 before:h-7 before:w-1 before:bg-gray-400 before:mt-3.5 before:rounded-r-sm">
              <div
                className={`items-center px-4 py-3 border rounded-lg shadow-sm max-w-5xl mx-auto space-y-4 ${
                  diagnosticReport?.id ? "bg-gray-100" : " "
                } `}
              >
                <div className="flex items-center gap-4 justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Order id
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-900">
                        {diagnosticReport?.based_on.id}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-900 rounded">
                        {diagnosticReport?.conclusion
                          ? "Under Review"
                          : "Completed"}
                      </span>
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
                      <div
                        className="max-w-5xl bg-white shadow rounded-lg p-6"
                        id="order-details"
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Left Section */}
                          <div className="w-full md:w-1/2 pl-2">
                            <h3 className="text-sm font-semibold text-gray-600">
                              Test
                            </h3>
                            <p className="font-semibold">
                              {diagnosticReport?.based_on.code.display ??
                                diagnosticReport?.based_on.code.code}
                            </p>
                          </div>

                          {/* Right Section */}
                          <div className="w-full md:w-1/2 md:border-l border-gray-300 sm:pl-4 sm:pb-4">
                            <h3 className="text-sm font-semibold text-gray-600">
                              Order Placed by
                            </h3>
                            <div className="flex gap-2">
                              <p className="text-lg font-semibold text-gray-900 mb-4">
                                {diagnosticReport?.based_on?.requester
                                  ?.first_name ?? "Dummy Name"}
                              </p>
                              <p className="text-lg font-normal text-gray-900 mb-4">
                                Dummy Designation
                              </p>
                            </div>

                            <h3 className="text-sm font-semibold text-gray-600">
                              Order Date/Time
                            </h3>
                            <p className="text-lg font-semibold text-gray-900 mb-4">
                              {diagnosticReport?.based_on.authored_on ?? "NA"}
                            </p>

                            <h3 className="text-sm font-semibold text-gray-600">
                              Priority
                            </h3>
                            <span className="px-3 py-1 inline-block text-sm font-semibold text-red-600 bg-red-100 rounded-lg">
                              {diagnosticReport?.based_on.priority ?? "Routine"}
                            </span>
                          </div>
                        </div>
                        {/* Note Section */}
                        <div className="border-t border-gray-300 px-2 py-4 max-w-4xl">
                          <h3 className="text-sm font-semibold text-gray-600">
                            Note:
                          </h3>
                          <p className="font-semibold">
                            {diagnosticReport?.based_on.note
                              .map((note) => note.text)
                              .join(",") || "NA"}
                          </p>
                        </div>
                      </div>

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
                                  {diagnosticReport?.specimen[0]?.collected_at}
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
                                  {diagnosticReport?.specimen[0]?.dispatched_at}
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
                                  {diagnosticReport?.specimen[0]?.received_at ??
                                    "NA"}
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
                                  on {diagnosticReport?.issued ?? "NA"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="border-l-[2.5px] border-gray-300 p-4 h-10"></div>
                        </div>
                      </div>
                      <div
                        className="bg-gray-100 border border-solid rounded-sm shadow-md space-y-2"
                        id="test-results"
                      >
                        <h2 className="text-base font-semibold text-gray-900 px-4 py-2">
                          Test Results:
                        </h2>
                        <Table className="w-full border  border-gray-300 bg-white shadow-sm rounded-sm">
                          <TableHeader className="bg-gray-100">
                            <TableRow>
                              <TableHead className="border-r border-slate-300">
                                Parameter
                              </TableHead>
                              <TableHead className="border-r border-solid">
                                Result
                              </TableHead>
                              <TableHead className="border-r border-solid">
                                Unit
                              </TableHead>
                              <TableHead className="border-r border-solid">
                                Reference Range
                              </TableHead>
                              <TableHead>Remark</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="bg-white">
                            {diagnosticReport?.result.map((observation) => (
                              <TableRow
                                key={observation.id}
                                className="divide-x divide-solid"
                              >
                                <TableCell>
                                  {observation.main_code?.display ??
                                    observation.main_code?.code}
                                </TableCell>
                                <TableCell>{observation.value}</TableCell>
                                <TableCell>Dummy Unit</TableCell>
                                <TableCell>Dummy Reference</TableCell>
                                <TableCell>Dummy Note</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

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
