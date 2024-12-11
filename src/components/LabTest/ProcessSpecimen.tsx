import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { FC, useState } from "react";
import { v4 as uuid } from "uuid";

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

import useAuthUser from "@/hooks/useAuthUser";

import routes from "@/Utils/request/api";
import request from "@/Utils/request/request";

import LabObservationCodeSelect from "./LabObservationCodeSelect";
import { Coding, DiagnosticReport, Specimen } from "./types";

export const ProcessSpecimen: FC = () => {
  const { id: currentUserId } = useAuthUser();

  const [specimen, setSpecimen] = useState<Specimen>();
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport>();

  const [observations, setObservations] = useState<
    {
      code?: Coding;
      result: string;
      unit: string;
      note: string;
    }[]
  >([]);

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
      <h2 className="text-2xl leading-tight">Start Processing</h2>
      <div className="flex flex-col">
        {specimen ? (
          <div className="space-y-4 bg-white shadow-sm rounded-sm p-4 gap-5">
            {/* Barcode Success Message */}
            <div className="flex items-center justify-between bg-gray-50 p-2">
              <div>
                <Label className="text-nomral font-medium text-gray-600">
                  Specimen id
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold leading-tight text-gray-900">
                    {specimen.accession_identifier ??
                      specimen.identifier ??
                      specimen.id.slice(0, 8)}
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
                  {specimen.type.display ?? specimen.type.code}
                </span>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Date of collection
                </Label>
                <span className="block text-gray-900 font-semibold mt-1">
                  {specimen.collected_at}
                </span>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Patient Name, ID
                </Label>
                <span className="block text-gray-900 font-semibold mt-1">
                  {specimen.subject.name}
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
                  {specimen.request.id}
                </span>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Tube Type
                </Label>
                <span className="block text-gray-900 font-semibold mt-1">
                  Not Specified
                </span>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Test
                </Label>
                <span className="block text-gray-900 font-semibold mt-1">
                  {specimen.request.code.display ?? specimen.request.code.code}
                </span>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Priority
                </Label>
                <Badge className="bg-red-100 text-red-600 px-2 py-1 text-xs font-medium mt-1">
                  {specimen.request.priority ?? "Routine"}
                </Badge>
              </div>
            </div>

            {/* Footer Buttons */}
            {!specimen?.processing.length && (
              <div className="flex items-center justify-end gap-4">
                <Button
                  disabled
                  variant="outline"
                  size="sm"
                  className="px-8 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    const { res, data } = await request(
                      routes.labs.specimen.process,
                      {
                        pathParams: {
                          id: specimen.id,
                        },
                        body: {
                          process: [
                            {
                              description:
                                "This step is an internal indication of status change from received to processing",
                              method: {
                                system: "http://snomed.info/sct",
                                code: "56245008",
                              },
                            },
                          ],
                        },
                      },
                    );

                    if (!res?.ok || !data) {
                      return;
                    }

                    setSpecimen(data);
                  }}
                  variant="primary"
                  size="sm"
                >
                  Start Processing
                </Button>
              </div>
            )}
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

                  setSpecimen(data);
                }
              }}
            />
          </div>
        )}
      </div>

      {!!specimen?.processing.length && !diagnosticReport && (
        <>
          {observations.map((observation, i) => (
            <div
              key={observation.code?.code}
              className="bg-white shadow-sm rounded-sm border border-gray-300 p-6 space-y-6"
            >
              {/* Header Section */}
              <div className="flex items-center justify-between w-full">
                <LabObservationCodeSelect
                  value={observation.code}
                  onSelect={(observation) => {
                    setObservations((observations) =>
                      observations.map((obs, index) =>
                        index === i ? { ...obs, code: observation } : obs,
                      ),
                    );
                  }}
                />

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600"
                  onClick={() => {
                    setObservations((observations) =>
                      observations.filter((_, index) => index !== i),
                    );
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
                  <Select
                    value={observation.unit}
                    onValueChange={(unit) =>
                      setObservations(
                        observations.map((obs, index) =>
                          index === i ? { ...obs, unit } : obs,
                        ),
                      )
                    }
                  >
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
                  <Input
                    type="text"
                    className="mt-1"
                    value={observation.result}
                    onChangeCapture={(e) => {
                      setObservations((observations) =>
                        observations.map((obs, index) =>
                          index === i
                            ? { ...obs, result: e.currentTarget.value }
                            : obs,
                        ),
                      );
                    }}
                  />
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
                  value={observation.note}
                  onChange={(e) =>
                    setObservations((observations) =>
                      observations.map((obs, index) =>
                        index === i ? { ...obs, note: e.target.value } : obs,
                      ),
                    )
                  }
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
            onClick={() => {
              setObservations((observations) => [
                ...observations,
                {
                  code: undefined,
                  result: "",
                  unit: "x10³/μL",
                  note: "",
                },
              ]);
            }}
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
              disabled={!observations.length}
              onClick={async () => {
                const { res: reportRes, data: reportData } = await request(
                  routes.labs.diagnosticReport.create,
                  {
                    body: {
                      based_on: (specimen.request as any).external_id,
                      specimen: [specimen.id],
                    },
                  },
                );

                if (!reportRes?.ok || !reportData) {
                  return;
                }

                const { res, data } = await request(
                  routes.labs.diagnosticReport.observations,
                  {
                    pathParams: {
                      id: reportData.id,
                    },
                    body: {
                      observations: observations.map((observation) => ({
                        id: uuid().toString(),
                        main_code: observation.code!,
                        value: observation.result,
                        status: "final",
                        effective_datetime: new Date().toISOString(),
                        data_entered_by_id: currentUserId,
                        subject_type: "patient",
                      })),
                    },
                  },
                );

                if (!res?.ok || !data) {
                  return;
                }

                setDiagnosticReport(data);
              }}
            >
              Submit
            </Button>
          </div>
        </>
      )}

      {diagnosticReport && (
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
              {diagnosticReport.result.map((observation) => (
                <TableRow
                  key={observation.id}
                  className="divide-x divide-gray-300"
                >
                  <TableCell>
                    {observation.main_code?.display ??
                      observation.main_code?.code}
                  </TableCell>
                  <TableCell>{observation.value}</TableCell>
                  <TableCell>{observation.reference_range?.unit}</TableCell>
                  <TableCell>Dummy Ref range</TableCell>
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
              disabled
            >
              <CrossCircledIcon className="h-4 w-4 text-red-500" />
              <span>Reject Result</span>
            </Button>
            <Button disabled variant="primary" size="sm" className="gap-2">
              <CheckCircledIcon className="h-4 w-4 text-white" />
              Approve Result
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
