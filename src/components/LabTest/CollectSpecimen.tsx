import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import React from "react";
import { FaDroplet } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";

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

// Updated Mock Data
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

export const CollectSpecimen: React.FC = () => {
  // Store orders in state so we can modify them
  const [orderData, setOrderData] = React.useState<Order[]>(initialOrders);

  const [openOrders, setOpenOrders] = React.useState<Record<string, boolean>>(
    {},
  );

  const toggleOrder = (orderId: string) => {
    setOpenOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  // Add a new specimen (sample) to the order
  const incrementSample = (orderId: string) => {
    setOrderData((prevOrders) =>
      prevOrders.map((order) => {
        if (order.orderId === orderId) {
          const specimenType = order.samples[0]?.specimenType || "Unknown";

          const newSample: Sample = {
            id: "SPEC" + Date.now(),
            specimenType,
            status: "Collection Pending",
          };
          return { ...order, samples: [...order.samples, newSample] };
        }
        return order;
      }),
    );
  };

  const decrementSample = (orderId: string) => {
    setOrderData((prevOrders) =>
      prevOrders.map((order) => {
        if (order.orderId === orderId && order.samples.length > 1) {
          return { ...order, samples: order.samples.slice(0, -1) };
        }
        return order;
      }),
    );
  };

  // Handle removing a collected sample: set its status to "Collection Pending"
  const handleRemoveCollectedSample = (
    orderId: string,
    sampleIndex: number,
  ) => {
    setOrderData((prevOrders) =>
      prevOrders.map((order) => {
        if (order.orderId === orderId) {
          return {
            ...order,
            samples: order.samples.map((s, i) =>
              i === sampleIndex ? { ...s, status: "Collection Pending" } : s,
            ),
          };
        }
        return order;
      }),
    );
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
            <Button variant="secondary" className="flex items-center gap-1">
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
              {orderData.filter((o) => o.status === "Pending").length}/
              {orderData.length} orders Pending
            </span>
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
                      <div className="max-w-5xl bg-white shadow rounded-lg p-6">
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
                                <FaDroplet />
                              </span>
                              <span className="text-gray-900 font-semibold">
                                {order.samples[0]?.specimenType}
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
                                {order.samples.length}
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
                        <div className="space-y-5">
                          {order.samples.map((sample, index) => {
                            const sampleCollected =
                              sample.status === "Collected";
                            return (
                              <div key={sample.id} className="bg-gray-100 pt-1">
                                <div
                                  className={`items-center px-4 py-3 border rounded-lg shadow-sm bg-white relative before:content-[''] before:absolute before:top-3 before:left-0 before:h-6 before:w-1 ${
                                    sampleCollected
                                      ? "before:bg-blue-600"
                                      : "before:bg-gray-400"
                                  } before:rounded-r-sm`}
                                >
                                  <div className="flex items-center justify-between ">
                                    <h3 className="text-sm font-semibold text-gray-600">
                                      {sampleCollected
                                        ? sample.id
                                        : `Sample ${index + 1}`}
                                    </h3>
                                    <span
                                      className={`ml-2 px-2 py-1 text-xs font-medium  ${
                                        sampleCollected
                                          ? "bg-blue-100 text-blue-600"
                                          : "text-orange-900 bg-orange-100"
                                      } rounded`}
                                    >
                                      {sample.status}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-4 px-4 py-3 bg-gray-100 space-y-4">
                                  <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-gray-900">
                                      Barcode
                                    </h3>

                                    {sampleCollected && (
                                      <Button
                                        className="flex items-center justify-between gap-2 bg-white px-2 py-2 rounded-md shadow-sm"
                                        variant={"outline"}
                                        onClick={() =>
                                          handleRemoveCollectedSample(
                                            order.orderId,
                                            index,
                                          )
                                        }
                                      >
                                        <CrossCircledIcon className="h-4 w-4 text-red-600" />
                                        <span className="font-semibold text-gray-900">
                                          Remove
                                        </span>
                                      </Button>
                                    )}
                                  </div>
                                  {sampleCollected ? (
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
                                            {sample.barcode}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <div className="items-center justify-between ">
                                          <h3 className="text-sm font-normal">
                                            Tube Type
                                          </h3>
                                          <span className="text-gray-900 font-semibold">
                                            {sample.tubeType}
                                          </span>
                                        </div>
                                        <div className="items-center justify-between">
                                          <h3 className="text-sm font-normal">
                                            Test
                                          </h3>
                                          <span className="text-gray-900 font-semibold">
                                            {order.test}
                                          </span>
                                        </div>
                                        <div className="items-center justify-between">
                                          <h3 className="text-sm font-normal">
                                            Collection Date/Time
                                          </h3>
                                          <span className="text-gray-900 font-semibold">
                                            {sample.collectionDateTime}
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
                                  )}
                                </div>
                              </div>
                            );
                          })}
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
