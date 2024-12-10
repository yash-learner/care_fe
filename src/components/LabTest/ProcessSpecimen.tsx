import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

export const ProcessSpecimen: React.FC = () => {
  const [isBarcodeScanned, setIsBarcodeScanned] = React.useState(false);

  const [results, setResults] = React.useState<number[]>([0]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const addResult = () => {
    setResults([...results, results.length]);
  };

  const handleScan = () => {
    // Simulate barcode scanning success
    setIsBarcodeScanned(true);
  };

  // Mock Test data
  const testResults = [
    {
      parameter: "Total Bilirubin",
      result: "1.2",
      unit: "mg/dL",
      referenceRange: "0.1 - 1.2",
      remark: "",
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
      <div className="flex flex-col">
        {isBarcodeScanned ? (
          <div className="space-y-4 bg-white shadow-sm rounded-sm p-4 gap-5">
            {/* Barcode Success Message */}
            <div className="flex items-center justify-between bg-gray-50 p-2">
              <div>
                <Label className="text-nomral font-medium text-gray-600">
                  Specimen id
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold leading-tight text-gray-900">
                    SPC122532
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-pink-100 text-pink-900 px-2 py-1 text-xs font-medium"
                  >
                    In Process
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <CrossCircledIcon className="h-4 w-4" />
                Remove
              </Button>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-normal text-gray-900">
                Barcode
              </Label>
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-sm font-medium text-green-900 border border-green-300 rounded-full bg-white">
                    Success
                  </span>
                  <span className="text-green-900 font-semibold">
                    Barcode Scanned Successfully
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Specimen type
                </Label>
                <span className="block text-gray-900 font-semibold mt-1">
                  Whole blood (EDTA)
                </span>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Date of collection
                </Label>
                <span className="block text-gray-900 font-semibold mt-1">
                  24 Nov 2024
                </span>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Patient Name, ID
                </Label>
                <span className="block text-gray-900 font-semibold mt-1">
                  John Honai
                </span>
                <span className="block text-gray-500 text-sm">
                  T105690908240017
                </span>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Order ID
                </Label>
                <span className="block text-gray-900 font-semibold mt-1">
                  CARE_LAB-001
                </span>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Tube Type
                </Label>
                <span className="block text-gray-900 font-semibold mt-1">
                  EDTA
                </span>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Test
                </Label>
                <span className="block text-gray-900 font-semibold mt-1">
                  Complete Blood Count (CBC)
                </span>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Priority
                </Label>
                <Badge className="bg-red-100 text-red-600 px-2 py-1 text-xs font-medium mt-1">
                  Stat
                </Badge>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-4">
              <Button variant="outline" size="sm" className="px-8 py-2">
                Cancel
              </Button>
              <Button variant="primary" size="sm">
                Verify Specimen
              </Button>
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

      {isBarcodeScanned && !isSubmitted && (
        <>
          {results.map((_, index) => (
            <div
              key={index}
              className="bg-white shadow-sm rounded-sm border border-gray-300 p-6 space-y-6"
            >
              {/* Header Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-lg font-semibold text-gray-900">
                    Result:
                  </Label>
                  <Select defaultValue="WBC">
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select Test" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RBC">Red Blood Cell (RBC)</SelectItem>
                      <SelectItem value="Hb">Hemoglobin (Hb)</SelectItem>
                      <SelectItem value="RDW">
                        Red Cell Distribution Width (RDW)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600"
                  onClick={() => {
                    setResults(results.filter((_, i) => i !== index));
                  }}
                >
                  <CrossCircledIcon className="h-4 w-4 me-2" />
                  Remove
                </Button>
              </div>

              {/* Input Section */}
              <div className="grid grid-cols-3 gap-4 items-center">
                {/* Unit */}
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Unit
                  </Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="x10⁶/μL" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="x10⁶/μL">x10⁶/μL</SelectItem>
                      <SelectItem value="x10³/μL">x10³/μL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Result */}
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Result (Ref. Interval: 4.0 - 11.0 x10³/μL)
                  </Label>
                  <Input type="text" className="mt-1" />
                </div>

                {/* Badge */}
                <div className="flex items-center gap-2">
                  <Badge
                    className="bg-green-100 text-green-600 px-2 py-1 text-xs font-medium mt-6"
                    variant="outline"
                  >
                    Normal
                  </Badge>
                </div>
              </div>

              {/* Note Section */}
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Note
                </Label>
                <Textarea
                  placeholder="Type your notes"
                  className="mt-1 text-gray-600"
                />
              </div>
            </div>
          ))}
          {/* Add another result button */}
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={addResult}
          >
            + Add Another Result
          </Button>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" size="lg">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                setIsSubmitted(true);
              }}
            >
              Submit
            </Button>
          </div>
        </>
      )}
      {isSubmitted && (
        <div className="bg-gray-50 border border-gray-300 rounded-sm shadow-sm p-2 space-y-2">
          <h2 className="text-base font-semibold text-gray-900">
            Test Results:
          </h2>
          <Table className="w-full border  border-gray-300 bg-whit shadow-sm rounded-sm">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="border-r border-gray-300">
                  Parameter
                </TableHead>
                <TableHead className="border-r border-gray-300">
                  Result
                </TableHead>
                <TableHead className="border-r border-gray-300">Unit</TableHead>
                <TableHead className="border-r border-gray-300">
                  Reference Range
                </TableHead>
                <TableHead>Remark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {testResults.map((test, index) => (
                <TableRow key={index} className="divide-x divide-gray-300">
                  <TableCell>{test.parameter}</TableCell>
                  <TableCell>{test.result}</TableCell>
                  <TableCell>{test.unit}</TableCell>
                  <TableCell>{test.referenceRange}</TableCell>
                  <TableCell>
                    <Input type="text" placeholder="" className="w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex gap-2 justify-end">
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
      )}
    </div>
  );
};
