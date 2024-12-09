import {
  CheckCircledIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import React from "react";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const ReceiveSpecimen: React.FC = () => {
  const [isBarcodeScanned, setIsBarcodeScanned] = React.useState(false);

  const handleScan = () => {
    // Simulate barcode scanning success
    setIsBarcodeScanned(true);
  };

  const specimenIntegrityChecks = [
    { parameter: "Clotting", options: ["No Clotting", "Clotted"] },
    { parameter: "Hemolysis", options: ["No Hemolysis", "Hemolyzed"] },
    { parameter: "Volume", options: ["Sufficient", "Insufficient"] },
    { parameter: "Labeling", options: ["Correct", "Incorrect"] },
    { parameter: "Container Condition", options: ["Intact", "Damaged"] },
  ];

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
        {isBarcodeScanned ? (
          <div className="space-y-4">
            {/* Barcode Success Message */}
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-md">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-sm font-medium text-green-900 border border-green-300 rounded-full bg-white">
                  Success
                </span>
                <span className="text-green-900 font-semibold">
                  Barcode Scanned Successfully
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4 bg-white">
              {/* Specimen ID */}
              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Specimen id
                </h3>
                <p className="text-base font-semibold text-gray-900">
                  SPC122532
                </p>
              </div>

              {/* Specimen Type */}
              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Specimen type
                </h3>
                <p className="text-base font-semibold text-gray-900">Blood</p>
              </div>

              {/* Date of Collection */}
              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Date of collection
                </h3>
                <p className="text-base font-semibold text-gray-900">
                  24 Nov 2024
                </p>
              </div>

              {/* Patient Name & ID */}
              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Patient Name, ID
                </h3>
                <p className="text-base font-semibold text-gray-900">
                  John Honai
                </p>
                <p className="text-sm text-gray-600">T105690908240017</p>
              </div>

              {/* Order ID */}
              <div>
                <h3 className="text-sm font-medium text-gray-600">Order ID</h3>
                <p className="text-base font-semibold text-gray-900">
                  CARE_LAB-001
                </p>
              </div>
            </div>

            {/* Specimen Information */}
            <div className="mt-4 bg-white rounded-md">
              {/* Specimen Integrity Check */}
              <div className="mt-4 bg-gray-50 rounded-sm p-4 flex flex-col gap-4">
                <div className="rounded-md space-y-4">
                  {/* Test and Tube Type */}
                  <div className="flex space-x-8">
                    <div>
                      <h3 className="text-sm font-normal text-gray-600">
                        Test
                      </h3>
                      <p className="text-base font-medium text-gray-900">
                        Complete Blood Count (CBC)
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-normal text-gray-600">
                        Tube Type
                      </h3>
                      <p className="text-base font-medium text-gray-900">
                        EDTA
                      </p>
                    </div>
                  </div>

                  {/* Instruction Box */}
                  <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex-shrink-0 p-2 bg-blue-100 rounded-md">
                      <CareIcon
                        icon="l-info-circle"
                        className="h-6 w-6 text-blue-600"
                      />
                    </div>
                    <p className="ml-4 text-sm font-medium text-blue-800">
                      Verify specimen integrity, including hemolysis, sufficient
                      volume, correct labeling, and proper container use, before
                      accepting or rejecting.
                    </p>
                  </div>
                </div>
                <Label className="text-sm font-medium text-gray-600">
                  Specimen Integrity Check
                </Label>
                <Table className="border border-gray-300 border-collapse w-full">
                  <TableHeader className="bg-gray-100">
                    <TableRow className="divide-x divide-gray-300">
                      <TableHead>Parameter</TableHead>
                      <TableHead>Evaluation</TableHead>
                      <TableHead>Notes (Optional)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specimenIntegrityChecks.map(({ parameter, options }) => (
                      <TableRow
                        key={parameter}
                        className="divide-x divide-gray-300"
                      >
                        <TableCell>{parameter}</TableCell>
                        <TableCell>
                          <RadioGroup className="flex gap-2">
                            {options.map((option) => (
                              <div className="flex items-center space-x-2 w-1/2">
                                <RadioGroupItem
                                  id={option}
                                  key={option}
                                  value={option}
                                  className={`inline-flex items-center gap-1 text-primary-700 border-green-900 bg-green-100 data-[state=checked]:bg-green-100 data-[state=unchecked]:bg-white`}
                                />
                                <Label htmlFor={option}>{option}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </TableCell>
                        <TableCell className="p-0">
                          <Input
                            type="text"
                            placeholder=""
                            className="w-full"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Action Buttons */}
                <div className="flex justify-between mt-4">
                  <Button variant="link" size="sm">
                    + Add Notes
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 font-medium gap-2"
                    >
                      <CrossCircledIcon className="h-4 w-4 text-red-500" />
                      <span>Reject Specimen</span>
                    </Button>
                    <Button variant="primary" size="sm" className="gap-2">
                      <CheckCircledIcon className="h-4 w-4 text-white" />
                      Accept Specimen
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label className="text-sm font-normal text-gray-900">Barcode</Label>
            <Input
              type="text"
              placeholder="Scan Barcode/Enter number"
              className="text-center"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleScan();
              }}
            />
          </div>
        )}
      </div>
      <div>
        <Label className="text-xl font-medium text-gray-900">
          Received at Lab
        </Label>
        <Collapsible>
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
                      SPEC009213
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
                        <div className="">
                          {/* {openOrders[order.orderId] ? (
                            <ChevronUpIcon className="h-6 w-8" />
                          ) : ( */}
                          <ChevronDownIcon className="h-6 w-8" />
                          {/* )} */}
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              <CollapsibleContent>
                <div className="max-w-5xl bg-white shadow rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-5 gap-4 bg-white">
                    {/* Patient Name & ID */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">
                        Patient Name, ID
                      </h3>
                      <p className="text-base font-semibold text-gray-900">
                        John Honai
                      </p>
                      <p className="text-sm text-gray-600">T105690908240017</p>
                    </div>

                    {/* Order ID */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">
                        Order ID
                      </h3>
                      <p className="text-base font-semibold text-gray-900">
                        CARE_LAB-001
                      </p>
                    </div>
                    {/* Specimen Type */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">
                        Specimen type
                      </h3>
                      <p className="text-base font-semibold text-gray-900">
                        Blood
                      </p>
                    </div>

                    {/* Date of Collection */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">
                        Date of collection
                      </h3>
                      <p className="text-base font-semibold text-gray-900">
                        24 Nov 2024
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-600">
                        Days since collection
                      </h3>
                      <p className="text-base font-semibold text-gray-900">3</p>
                    </div>
                  </div>
                  {/* Note Section */}
                  <div className="max-w-4xl">
                    <h3 className="text-sm font-semibold text-gray-600">
                      Note:
                    </h3>
                    <p className="text-gray-700">
                      Prescribed CBC to check for anemia or infection and LFT to
                      evaluate liver health due to complaints of fatigue and
                      mild abdominal discomfort. The package containing the
                      specimen was received intact, with no signs of damage or
                      tampering. The temperature monitoring device indicated the
                      specimen was maintained at the proper frozen temperature
                      during transport. No unusual odors or leakage were
                      observed upon opening the package.
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </div>
        </Collapsible>
      </div>
    </div>
  );
};
