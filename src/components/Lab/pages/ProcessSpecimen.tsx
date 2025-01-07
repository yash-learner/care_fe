import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { FaDroplet } from "react-icons/fa6";
import { v4 as uuid } from "uuid";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { ResultTable } from "@/components/Common/ResultTable";

import useAuthUser from "@/hooks/useAuthUser";
import useOnClickOutside from "@/hooks/useOnClickOutside";

import * as Notification from "@/Utils/Notifications";
import routes from "@/Utils/request/api";
import request from "@/Utils/request/request";
import { DiagnosticReport } from "@/types/emr/diagnosticReport";
import { Specimen } from "@/types/emr/specimen";
import { Code } from "@/types/questionnaire/code";

import LabObservationCodeSelect from "../LabObservationCodeSelect";
import { SpecimenCard } from "../SpecimenCard";
import { getPriorityColor } from "../utils";

type ProcessSpecimenProps = {
  specimenId?: string;
};

export const ProcessSpecimen = ({ specimenId }: ProcessSpecimenProps) => {
  const { id: currentUserId } = useAuthUser();

  const [specimen, setSpecimen] = useState<Specimen>();
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport>();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (specimenId) {
      (async () => {
        const { res, data } = await request(routes.labs.specimen.get, {
          pathParams: {
            id: specimenId,
          },
        });

        if (!res?.ok || !data) {
          return;
        }

        setSpecimen(data);
      })();
    }
  }, [specimenId]);

  useEffect(() => {
    if (specimen) {
      (async () => {
        const { res, data } = await request(routes.labs.diagnosticReport.list, {
          query: {
            specimen: specimen.id,
            based_on: (specimen.request as any).external_id,
            status: "partial",
            ordering: "-created_date",
          },
        });

        if (!res?.ok || !data?.results?.length) {
          return;
        }

        setDiagnosticReport(data.results[0]);
      })();
    }
  }, [specimen]);

  const [observations, setObservations] = useState<
    {
      code?: Code;
      result: string;
      unit: string;
      note: string;
    }[]
  >([]);

  const commandRef = useRef<HTMLDivElement>(null);

  const [showOptions, setShowOptions] = useState(false);

  useOnClickOutside(commandRef, () => {
    setShowOptions(false);
  });

  const handleStartProcessing = async () => {
    if (!specimen) return;

    const { res, data } = await request(routes.labs.specimen.process, {
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
    });

    if (!res?.ok || !data) {
      // Handle error accordingly
      return;
    }

    setSpecimen(data);
  };

  const handleRemoveSpecimen = () => {
    // Implement specimen removal logic here
    setSpecimen(undefined);
  };

  const analyzers = [
    { id: "1", name: "Analyzer 1", description: "Description for Analyzer 1" },
    { id: "2", name: "Analyzer 2", description: "Description for Analyzer 2" },
    { id: "3", name: "Analyzer 3", description: "Description for Analyzer 3" },
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
      <h2 className="text-2xl leading-tight">Start Processing</h2>
      <div className="flex flex-col">
        {specimen ? (
          <SpecimenCard
            specimen={specimen}
            onRemove={handleRemoveSpecimen}
            onStartProcessing={handleStartProcessing}
            observations={observations}
            setObservations={setObservations}
          />
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
        <div className="space-y-4">
          {/* Todo: Extra this into a separate component if not done already at some where else*/}

          <div className="bg-white shadow-sm rounded-sm border border-gray-300 p-4 space-y-4 hidden">
            {/* Label */}
            <div className="grid gap-1.5">
              <Label htmlFor="analyzer-select">Select Analyzer</Label>
              <div>
                <Command
                  ref={commandRef}
                  onFocus={() => setShowOptions(true)}
                  className={`border ${!showOptions && "divide-y-0"}`}
                >
                  <CommandInput
                    id="analyzer-select"
                    className="shadow-none border-none focus:ring-0"
                    placeholder="Search analyzer"
                    value={query}
                    onValueChange={setQuery}
                  />
                  {showOptions && (
                    <CommandList className="max-h-36">
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {analyzers.map((analyzer) => (
                          <CommandItem
                            key={analyzer.id}
                            onSelect={() => {
                              setQuery(analyzer.name);
                              setShowOptions(false);
                            }}
                            className="cursor-pointer"
                          >
                            <div className="flex justify-between gap-2 w-full">
                              <p>
                                <span className="font-semibold text-gray-900">
                                  {analyzer.name}
                                </span>
                                <br />
                                <span className="text-xs font-semibold text-gray-500">
                                  {analyzer.description}
                                </span>
                              </p>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  )}
                </Command>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              <Button variant="outline" size="lg">
                Skip this step
              </Button>
              <Button variant="primary" className="">
                Assign Analyzer
              </Button>
            </div>
          </div>
          <div className="flex-col justify-between items-center p-4 mb-4 space-y-2 bg-white shadow-sm rounded-sm border border-gray-300 hidden">
            <div className="space-y-1 w-full flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-600">
                Specimen Type:
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
                <span className="text-gray-900 font-semibold">Serum</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  -
                </Button>
                <span className="px-4 py-2 bg-gray-50 rounded-md shadow-sm border text-center">
                  1
                </span>
                <Button variant="outline" size="sm" disabled>
                  +
                </Button>
              </div>
            </div>
            <div className="bg-gray-100 pt-1">
              <div
                className={`items-center px-4 py-3 border rounded-lg shadow-sm bg-white relative before:content-[''] before:absolute before:top-3 before:left-0 before:h-6 before:w-1 ${
                  false ? "before:bg-blue-600" : "before:bg-gray-400"
                } before:rounded-r-sm`}
              >
                <div className="flex items-center justify-between ">
                  <h3 className="text-sm font-semibold text-gray-600">
                    Aliquot 1:
                  </h3>
                  <span
                    className={`ml-2 px-2 py-1 text-xs font-medium  ${
                      2 / 2 != 1
                        ? "bg-blue-100 text-blue-600"
                        : "text-orange-900 bg-orange-100"
                    } rounded`}
                  >
                    {2 / 2 != 1 ? "Collected" : "Not Collected"}
                  </span>
                </div>
              </div>
              <div className="mt-4 px-4 py-3 bg-gray-100 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Barcode
                  </h3>

                  {false && (
                    <Button
                      className="flex items-center justify-between gap-2 bg-white px-2 py-2 rounded-md shadow-sm"
                      variant={"outline"}
                      disabled
                    >
                      <CrossCircledIcon className="h-4 w-4 text-red-600" />
                      <span className="font-semibold text-gray-900">
                        Remove
                      </span>
                    </Button>
                  )}
                </div>
                {false ? (
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
                          123456700
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="items-center justify-between ">
                        <h3 className="text-sm font-normal">Tube Type</h3>
                        <span className="text-gray-900 font-semibold">
                          Not Available
                        </span>
                      </div>
                      <div className="items-center justify-between">
                        <h3 className="text-sm font-normal">Test</h3>
                        <span className="text-gray-900 font-semibold">
                          Not Available
                        </span>
                      </div>
                      <div className="items-center justify-between">
                        <h3 className="text-sm font-normal">
                          Collection Date/Time
                        </h3>
                        <span className="text-gray-900 font-semibold">
                          11-Dec-2021 12:00 PM
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
                    <div className="text-gray-600 text-sm">OR</div>
                    <div className="w-full">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        disabled
                      >
                        Generate Barcode
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="lg" className="mt-2">
                Skip this step
              </Button>
            </div>
          </div>
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
                        status: "final" as "final",
                        effective_datetime: new Date().toISOString(),
                        data_entered_by_id: currentUserId,
                        subject_type: "patient" as "patient",
                        note: observation.note,
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
        </div>
      )}
      {diagnosticReport && (
        <div className="bg-gray-50 border border-gray-300 rounded-sm shadow-sm p-2 space-y-2">
          <h2 className="text-base font-semibold text-gray-900">
            Test Results:
          </h2>
          <ResultTable
            columns={[
              {
                key: "parameter",
                label: "Parameter",
                headerClass: "border-r border-gray-300",
              },
              {
                key: "result",
                label: "Result",
                headerClass: "border-r border-gray-300",
              },
              {
                key: "unit",
                label: "Unit",
                headerClass: "border-r border-gray-300",
              },
              {
                key: "referenceRange",
                label: "Reference Range",
                headerClass: "border-r border-gray-300",
              },
              { key: "remark", label: "Remark" },
            ]}
            data={diagnosticReport.result.map((observation) => ({
              parameter:
                observation.main_code?.display ?? observation.main_code?.code,
              result: String(observation.value),
              unit: observation.reference_range?.unit,
              referenceRange: "Dummy Ref range",
              remark: observation.note,
            }))}
          />
          {diagnosticReport.status !== "preliminary" && (
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
              <Button
                onClick={async () => {
                  const { res, data } = await request(
                    routes.labs.diagnosticReport.verify,
                    {
                      pathParams: {
                        id: diagnosticReport.id,
                      },
                      body: {
                        is_approved: true,
                      },
                    },
                  );

                  if (!res?.ok || !data) {
                    return;
                  }

                  Notification.Success({
                    msg: "Result approved successfully, and result is under review",
                  });
                  setDiagnosticReport(data);
                }}
                variant="primary"
                size="sm"
                className="gap-2"
              >
                <CheckCircledIcon className="h-4 w-4 text-white" />
                Approve Result
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
