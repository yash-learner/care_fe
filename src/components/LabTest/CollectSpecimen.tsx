import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import React from "react";
import { FaDroplet } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";

interface Order {
  orderId: string;
  specimen: string;
  status: string;
}

// Mock Data
const orders: Order[] = [
  { orderId: "CARE_LAB-001", specimen: "Blood", status: "Pending" },
  { orderId: "CARE_LAB-002", specimen: "Urine", status: "Pending" },
];

export const CollectSpecimen: React.FC = () => {
  const [openOrders, setOpenOrders] = React.useState<Record<string, boolean>>(
    {},
  );
  const [samples, setSamples] = React.useState<Record<string, number>>(
    orders.reduce((acc, order) => ({ ...acc, [order.orderId]: 1 }), {}),
  );

  const toggleOrder = (orderId: string) => {
    setOpenOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const incrementSample = (orderId: string) => {
    setSamples((prev) => ({ ...prev, [orderId]: prev[orderId] + 1 }));
  };

  const decrementSample = (orderId: string) => {
    setSamples((prev) => ({
      ...prev,
      [orderId]: Math.max(1, prev[orderId] - 1),
    }));
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row min-h-screen">
      {/* Left - Navigation/Progress Bar */}
      <nav className="w-full lg:max-w-xs bg-gray-100 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
        <ul className="relative">
          {/* Order Placed */}
          <li className="flex gap-2 before:content-[''] before:block before:h-10">
            <div className="relative last:after:hidden after:absolute after:top-4 after:bottom-0 after:left-2 after:w-px after:bg-gray-300 ">
              <div className="relative z-10 h-4 w-4 rounded-full bg-green-600"></div>
            </div>
            <span className="text-green-600">Order Placed</span>
          </li>

          {/* Specimen Collection */}
          <li className="flex gap-2 before:content-[''] before:block before:h-10">
            <div className="relative last:after:hidden after:absolute after:top-0 after:bottom-0 after:left-2 after:w-px after:bg-gray-300 ">
              <div className="relative z-10 h-4 w-4 rounded-full bg-blue-600"></div>
            </div>
            <span className="text-blue-600">Specimen Collection</span>
          </li>

          {/* Sent to Lab */}
          <li className="flex gap-2 before:content-[''] before:block before:h-10">
            <div className="relative last:after:hidden after:absolute after:top-0 after:bottom-0 after:left-2 after:w-px after:bg-gray-300">
              <div className="relative z-10 h-4 w-4 rounded-full bg-gray-300"></div>
            </div>
            <span className="text-gray-600">Sent to Lab</span>
          </li>

          {/* Received at Lab */}
          <li className="flex gap-2 before:content-[''] before:block before:h-10">
            <div className="relative last:after:hidden after:absolute after:top-0 after:bottom-0 after:left-2 after:w-px after:bg-gray-300">
              <div className="relative z-10 h-4 w-4 rounded-full bg-gray-300"></div>
            </div>
            <span className="text-gray-600">Received at Lab</span>
          </li>

          {/* Test Ongoing */}
          <li className="flex gap-2 before:content-[''] before:block before:h-10">
            <div className="relative last:after:hidden after:absolute after:top-0 after:bottom-0 after:left-2 after:w-px after:bg-gray-300">
              <div className="relative z-10 h-4 w-4 rounded-full bg-gray-300"></div>
            </div>
            <span className="text-gray-60">Test Ongoing</span>
          </li>

          {/* Under Review */}
          <li className="flex gap-2 before:content-[''] before:block before:h-10">
            <div className="relative last:after:hidden after:absolute after:top-0 after:bottom-0 after:left-2 after:w-px after:bg-gray-300">
              <div className="relative z-10 h-4 w-4 rounded-full bg-gray-300"></div>
            </div>
            <span className="text-gray-600">Under Review</span>
          </li>

          {/* Completed */}
          <li className="flex gap-2 before:content-[''] before:block before:h-10">
            <div className="relative z-10 h-4 w-4 rounded-full bg-gray-300"></div>
            <span className="text-gray-600">Completed</span>
          </li>
        </ul>
      </nav>

      {/* Right - Main Content */}
      <main className="flex-1 p-6 lg:p-8 max-w-5xl">
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
          <div className="flex items-center justify-center">
            <h2 className="text-2xl leading-tight">Collect Specimen</h2>
          </div>
          <div className="space-x-4 flex mt-4 lg:mt-0">
            <Button variant={"link"}>Specimen Collected</Button>
            <Button variant="secondary">Next Patient</Button>
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
            <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-900 rounded">
              2/2 orders Pending
            </span>
          </div>
        </div>
        {orders.map((order) => (
          <div key={order.orderId} className="mb-4">
            <Collapsible
              // open={isOpen}
              // onOpenChange={setIsOpen}
              open={!!openOrders[order.orderId]}
              onOpenChange={() => toggleOrder(order.orderId)}
            >
              <div className="relative before:content-[''] before:absolute before:top-0 before:left-0 before:h-7 before:w-1 before:bg-gray-400 before:mt-3.5 before:rounded-r-sm">
                <div
                  className={`items-center px-4 py-3 border rounded-lg shadow-sm max-w-5xl mx-auto space-y-4 ${openOrders[order.orderId] ? "bg-gray-100" : " "} `}
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
                          Pending
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">
                        Specimen to be collected:{" "}
                        <span className="font-semibold text-gray-900">
                          Blood
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
                      <div className="max-w-5xl bg-white shadow rounded-lg p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Left Section */}
                          <div className="w-full md:w-1/2 pl-2">
                            <h3 className="text-sm font-semibold text-gray-600">
                              Test
                            </h3>
                            <p className="font-semibold">
                              Complete Blood Count (CBC)
                            </p>
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
                          <p className="text-gray-700">
                            Prescribed CBC to check for anemia or infection and
                            LFT to evaluate liver health due to complaints of
                            fatigue and mild abdominal discomfort.
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
                            <div className="flex items-center gap-2 px-2 py-2 bg-gray-50 rounded-md shadow-sm border w-full">
                              <span className="">
                                {/* Specimen Icon */}
                                <FaDroplet />
                              </span>
                              <span className="text-gray-900 font-semibold">
                                Blood
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => decrementSample(order.orderId)}
                              >
                                -
                              </Button>
                              <span className="px-4 py-2 bg-gray-50 rounded-md shadow-sm border text-center">
                                {samples[order.orderId]}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => incrementSample(order.orderId)}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>

                        {Array.from(
                          { length: samples[order.orderId] },
                          (_, index) => (
                            <div key={index} className="bg-gray-100 pt-1 mb-8">
                              <div
                                className={`items-center px-4 py-3 border rounded-lg shadow-sm bg-white relative before:content-[''] before:absolute before:top-3 before:left-0 before:h-6 before:w-1 before:bg-gray-400 before:rounded-r-sm`}
                              >
                                <div className="flex items-center justify-between ">
                                  <h3 className="text-sm font-semibold text-gray-600">
                                    Sample {index + 1}
                                  </h3>
                                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-900 rounded">
                                    Collection Pending
                                  </span>
                                </div>
                              </div>
                              <div className="mt-4 px-4 py-3 bg-gray-100 space-y-4">
                                <h3 className="text-sm font-semibold text-gray-600">
                                  Barcode
                                </h3>
                                <div className="flex items-center justify-between space-x-4 bg-gray-100">
                                  <div className="bg-white w-full">
                                    <Input
                                      type="text"
                                      placeholder="Scan Barcode/Enter number"
                                      className="text-center"
                                    />
                                  </div>
                                  <div className="text-gray-600 text-sm">
                                    OR
                                  </div>
                                  <div className="w-full">
                                    <Button
                                      variant="outline"
                                      size="lg"
                                      className="w-full"
                                    >
                                      Generate Barcode
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
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
