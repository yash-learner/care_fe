import {
  CheckCircledIcon,
  ChevronDownIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import dayjs from "dayjs";
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

import routes from "@/Utils/request/api";
import request from "@/Utils/request/request";

import { Textarea } from "../ui/textarea";
import { Specimen } from "./types";

export const ReceiveSpecimen: React.FC = () => {
  const [scannedSpecimen, setScannedSpecimen] = React.useState<Specimen>();
  const [note, setNote] = React.useState<string>();
  const [approvedSpecimens, setApprovedSpecimens] = React.useState<Specimen[]>(
    [],
  );

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
        {scannedSpecimen ? (
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
                  {scannedSpecimen.identifier ?? scannedSpecimen.id}
                </p>
              </div>

              {/* Specimen Type */}
              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Specimen type
                </h3>
                <p className="text-base font-semibold text-gray-900">
                  {scannedSpecimen.type.display ?? scannedSpecimen.type.code}
                </p>
              </div>

              {/* Date of Collection */}
              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Date of collection
                </h3>
                <p className="text-base font-semibold text-gray-900">
                  {scannedSpecimen.collected_at}
                </p>
              </div>

              {/* Patient Name & ID */}
              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  Patient Name, ID
                </h3>
                <p className="text-base font-semibold text-gray-900">
                  {scannedSpecimen.subject.name}
                </p>
                <p className="text-sm text-gray-600">"T105690908240017"</p>
              </div>

              {/* Order ID */}
              <div>
                <h3 className="text-sm font-medium text-gray-600">Order ID</h3>
                <p className="text-base font-semibold text-gray-900">
                  {scannedSpecimen.request.id.slice(0, 8)}
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
                        {scannedSpecimen.type.display ??
                          scannedSpecimen.type.code}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-normal text-gray-600">
                        Tube Type
                      </h3>
                      <p className="text-base font-medium text-gray-900">
                        Not Specified
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
                      {scannedSpecimen.request.note
                        .map((note) => note.text)
                        .join("\n") || "No note provided"}
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

                {note !== undefined && (
                  <div className="grid gap-1.5">
                    <Label htmlFor="note">Note</Label>
                    <Textarea
                      onChange={(e) => setNote(e.currentTarget.value)}
                      value={note}
                      placeholder="Type your note here."
                      id="note"
                      className="bg-white"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between mt-4">
                  {note === undefined ? (
                    <Button
                      onClick={() => setNote("")}
                      variant="link"
                      size="sm"
                    >
                      + Add Notes
                    </Button>
                  ) : (
                    <div />
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 font-medium gap-2"
                      disabled
                    >
                      <CrossCircledIcon className="h-4 w-4 text-red-500" />
                      <span>Reject Specimen</span>
                    </Button>
                    <Button
                      onClick={async () => {
                        const { res, data } = await request(
                          routes.labs.specimen.ReceiveAtLab,
                          {
                            pathParams: {
                              id: scannedSpecimen.id,
                            },
                            body: {
                              note: note
                                ? {
                                    text: note,
                                  }
                                : undefined,
                            },
                          },
                        );

                        if (!res?.ok || !data) {
                          return;
                        }

                        setApprovedSpecimens((prev) => [...prev, data]);
                        setScannedSpecimen(undefined);
                        setNote(undefined);
                      }}
                      variant="primary"
                      size="sm"
                      className="gap-2"
                    >
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
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  const barcode = e.currentTarget.value;

                  const { res, data } = await request(
                    routes.labs.specimen.get,
                    {
                      pathParams: {
                        id: barcode,
                      },
                    },
                  );

                  if (!res?.ok || !data) {
                    return;
                  }

                  setScannedSpecimen(data);
                }
              }}
            />
          </div>
        )}
      </div>
      <div>
        <Label className="text-xl font-medium text-gray-900">
          Received at Lab
        </Label>

        <div className="flex flex-col gap-4 mt-6">
          {approvedSpecimens.map((specimen) => (
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
                          {specimen.identifier ?? specimen.id}
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
                            {specimen.subject.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            T105690908240017
                          </p>
                        </div>

                        {/* Order ID */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-600">
                            Order ID
                          </h3>
                          <p className="text-base font-semibold text-gray-900">
                            {specimen.request.id.slice(0, 8)}
                          </p>
                        </div>
                        {/* Specimen Type */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-600">
                            Specimen type
                          </h3>
                          <p className="text-base font-semibold text-gray-900">
                            {specimen.type.display ?? specimen.type.code}
                          </p>
                        </div>

                        {/* Date of Collection */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-600">
                            Date of collection
                          </h3>
                          <p className="text-base font-semibold text-gray-900">
                            {specimen.collected_at}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-600">
                            Days since collection
                          </h3>
                          <p className="text-base font-semibold text-gray-900">
                            {dayjs().diff(dayjs(specimen.collected_at), "day")}
                          </p>
                        </div>
                      </div>
                      {/* Note Section */}
                      <div className="max-w-4xl">
                        <h3 className="text-sm font-semibold text-gray-600">
                          Note:
                        </h3>
                        <p className="text-gray-700">
                          {specimen.request.note
                            .map((note) => note.text)
                            .join("\n") || "No note provided for the lab order"}

                          <br />
                          <br />

                          {specimen.note.map((note) => note.text).join("\n") ||
                            "No note provided"}
                        </p>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </div>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};
