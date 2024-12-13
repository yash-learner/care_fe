import {
  ArrowRightIcon,
  CheckCircledIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import React from "react";

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

interface Sample {
  id: string;
  status: string;
  barcode?: string;
  tubeType?: string;
  collectionDateTime?: string;
  specimenType: string;
}

interface Order {
  orderId: string;
  status: string;
  test: string;
  samples: Sample[];
}

// Mock Data
const initialOrders: Order[] = [
  {
    orderId: "CARE_LAB-001",
    status: "Pending",
    test: "Complete Blood Count (CBC)",
    samples: [
      {
        id: "SPEC009213",
        specimenType: "Blood",
        status: "Collection Pending",
      },
      {
        id: "SPEC009213-2",
        specimenType: "Blood",
        status: "Collected",
        barcode: "123456789",
        tubeType: "EDTA",
        collectionDateTime: "28-Nov-2024, 2:30PM",
      },
    ],
  },
  {
    orderId: "CARE_LAB-002",
    status: "Pending",
    test: "Urine Analysis",
    samples: [
      {
        id: "SPEC009412",
        specimenType: "Urine",
        status: "Collection Pending",
      },
    ],
  },
];
const testResults = [
  {
    parameter: "Total Bilirubin",
    result: "1.2",
    unit: "mg/dL",
    referenceRange: "0.1 - 1.2",
    remark: "Boderline High",
  },
  {
    parameter: "Direct Bilirubin",
    result: "0.3",
    unit: "mg/dL",
    referenceRange: "0.0 - 0.4",
    remark: "",
  },
  {
    parameter: "ALT",
    result: "42",
    unit: "U/L",
    referenceRange: "7 - 56",
    remark: "",
  },
  {
    parameter: "AST",
    result: "37",
    unit: "U/L",
    referenceRange: "5 - 40",
    remark: "",
  },
  {
    parameter: "ALP",
    result: "112",
    unit: "U/L",
    referenceRange: "40 - 129",
    remark: "",
  },
  {
    parameter: "Albumin",
    result: "4.4",
    unit: "g/dL",
    referenceRange: "3.5 - 5.0",
    remark: "",
  },
  {
    parameter: "Total Protein",
    result: "7.2",
    unit: "g/dL",
    referenceRange: "6.4 - 8.3",
    remark: "",
  },
];

export const ReviewResult: React.FC<{
  specimenId: string;
}> = ({ specimenId }) => {
  // Store orders in state so we can modify them
  const [orderData, setOrderData] = React.useState<Order[]>(initialOrders);

  const [openOrders, setOpenOrders] = React.useState<Record<string, boolean>>(
    {},
  );

  const toggleOrder = (orderId: string) => {
    setOpenOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

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
              <p className="font-semibold ">John Honai</p>
            </div>
            <div>
              <p className="">UHID</p>
              <p className="font-semibold">T105690908240017</p>
            </div>
            <div>
              <p className="">Age/Sex</p>
              <p className="font-semibold ">58/Male</p>
            </div>
          </div>
          <div>
            <Button variant={"link"} className="text-blue-700">
              Patient Health Profile
            </Button>
          </div>
        </div>
        {orderData.map((order) => (
          <div key={order.orderId} className="mb-4">
            <Collapsible
              open={!!openOrders[order.orderId]}
              onOpenChange={() => toggleOrder(order.orderId)}
            >
              <div className="relative before:content-[''] before:absolute before:top-0 before:left-0 before:h-7 before:w-1 before:bg-gray-400 before:mt-3.5 before:rounded-r-sm">
                <div
                  className={`items-center px-4 py-3 border rounded-lg shadow-sm max-w-5xl mx-auto space-y-4 ${
                    openOrders[order.orderId] ? "bg-gray-100" : " "
                  } `}
                >
                  <div className="flex items-center gap-4 justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Order id
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">
                          {order.orderId}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-900 rounded">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">
                        Specimen to be collected:{" "}
                        <span className="font-semibold text-gray-900">
                          {order.samples[0]?.specimenType}
                        </span>
                      </span>
                      <div className="flex items-center gap-4">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <div className="">
                              {openOrders[order.orderId] ? (
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
                              <p className="font-semibold">{order.test}</p>
                            </div>

                            {/* Right Section */}
                            <div className="w-full md:w-1/2 md:border-l border-gray-300 sm:pl-4 sm:pb-4">
                              <h3 className="text-sm font-semibold text-gray-600">
                                Order Placed by
                              </h3>
                              <div className="flex gap-2">
                                <p className="text-lg font-semibold text-gray-900 mb-4">
                                  Dr. Jahnab Dutta,
                                </p>
                                <p className="text-lg font-normal text-gray-900 mb-4">
                                  Cardiologist
                                </p>
                              </div>

                              <h3 className="text-sm font-semibold text-gray-600">
                                Order Date/Time
                              </h3>
                              <p className="text-lg font-semibold text-gray-900 mb-4">
                                28-Nov-2024, 2:30PM
                              </p>

                              <h3 className="text-sm font-semibold text-gray-600">
                                Priority
                              </h3>
                              <span className="px-3 py-1 inline-block text-sm font-semibold text-red-600 bg-red-100 rounded-lg">
                                Stat
                              </span>
                            </div>
                          </div>
                          {/* Note Section */}
                          <div className="border-t border-gray-300 px-2 py-4 max-w-4xl">
                            <h3 className="text-sm font-semibold text-gray-600">
                              Note:
                            </h3>
                            <p className="font-semibold">
                              Prescribed CBC to check for anemia or infection
                            </p>
                          </div>
                        </div>

                        <div
                          className="sticky flex w-full ms-8"
                          id="sample-actions"
                        >
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
                                      Aisha Mohamed
                                    </span>
                                  </div>
                                  <span className="text-sm">
                                    on 28 Nov 3:32 PM
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
                                      Sanjay Patel
                                    </span>
                                  </div>
                                  <span className="text-sm">
                                    on 28 Nov 4:56 PM
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
                                        Medcore Laboratories
                                      </span>
                                      by:
                                    </span>
                                    <span className="text-sm font-semibold ps-1">
                                      Amar singh
                                    </span>
                                  </div>
                                  <span className="text-sm">
                                    on 29 Nov 10:10 AM
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
                                      Sam George
                                    </span>
                                  </div>
                                  <span className="text-sm">
                                    on 29 Nov 2:22 PM
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="border-l-[2.5px] border-gray-300 p-4 h-10"></div>
                          </div>
                        </div>
                        <div
                          className="bg-gray-100 border border-solid rounded-sm shadow-sm space-y-2 sticky"
                          id="test-results"
                        >
                          <h2 className="text-base font-semibold text-gray-900 p-2">
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
                              {testResults.map((test, index) => (
                                <TableRow
                                  key={index}
                                  className="divide-x divide-solid"
                                >
                                  <TableCell>{test.parameter}</TableCell>
                                  <TableCell>{test.result}</TableCell>
                                  <TableCell>{test.unit}</TableCell>
                                  <TableCell>{test.referenceRange}</TableCell>
                                  <TableCell>{test.remark}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>

                          <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-md shadow-inner">
                            <h3 className="text-sm font-medium text-gray-600">
                              Note
                            </h3>
                            <Textarea
                              placeholder="Type your notes"
                              className="bg-white border border-gray-300 rounded-sm"
                            />
                          </div>

                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="link"
                              size="sm"
                              className="border-gray-300 font-medium gap-2"
                            >
                              <CareIcon icon="l-sync" className="size-4" />
                              <span>Re-run Tests</span>
                            </Button>
                            <Button
                              variant="link"
                              size="sm"
                              className="border-gray-300 font-medium gap-2"
                            >
                              <CareIcon icon="l-pen" className="size-4" />
                              <span>Re-run Tests</span>
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              className="gap-2"
                            >
                              <CheckCircledIcon className="h-4 w-4 text-white" />
                              Approve Results
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </div>
            </Collapsible>
          </div>
        ))}
      </main>
    </div>
  );
};
