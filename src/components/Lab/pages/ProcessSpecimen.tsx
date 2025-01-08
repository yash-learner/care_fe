import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ResultTable } from "@/components/Common/ResultTable";

import useAuthUser from "@/hooks/useAuthUser";

import * as Notification from "@/Utils/Notifications";
import routes from "@/Utils/request/api";
import request from "@/Utils/request/request";
import { DiagnosticReport } from "@/types/emr/diagnosticReport";
import { LabObservation } from "@/types/emr/observation";
import { Specimen } from "@/types/emr/specimen";

import { LabObservationQuestion } from "../LabObservationQuestion";
import { SpecimenCard } from "../SpecimenCard";

export const ProcessSpecimen = ({ specimenId }: { specimenId?: string }) => {
  const { id: currentUserId } = useAuthUser();

  const [specimen, setSpecimen] = useState<Specimen>();
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport>();

  useEffect(() => {
    if (specimenId) {
      (async () => {
        const { res, data } = await request(routes.labs.specimen.get, {
          pathParams: {
            id: specimenId,
          },
        });

        if (!res?.ok || !data) {
          // Handle error accordingly
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
          // Handle error accordingly
          return;
        }

        setDiagnosticReport(data.results[0]);
      })();
    }
  }, [specimen]);

  const [observations, setObservations] = useState<LabObservation[]>([]);

  const handleRemoveSpecimen = () => {
    // Implement specimen removal logic here
    setSpecimen(undefined);
  };

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

  const handleSubmitObservations = async () => {
    if (!specimen || observations.length === 0) return;

    console.log(specimen, observations);
    console.log(specimen.request.id);
    console.log((specimen.request as any).external_id, "external_id");

    const { res: reportRes, data: reportData } = await request(
      routes.labs.diagnosticReport.create,
      {
        body: {
          based_on: specimen.request.id,
          specimen: [specimen.id],
        },
      },
    );

    if (!reportRes?.ok || !reportData) {
      // Handle error accordingly
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
            id: uuid(),
            main_code: observation.code!,
            value_type: "quantity",
            value: observation.result,
            status: "final" as const,
            effective_datetime: new Date().toISOString(),
            data_entered_by_id: currentUserId,
            subject_type: "patient" as const,
            note: observation.note,
            created_by_id: currentUserId,
            updated_by_id: currentUserId,
          })),
        },
      },
    );

    if (!res?.ok || !data) {
      // Handle error accordingly
      return;
    }

    setDiagnosticReport(data);
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col py-1">
      <Button
        variant="outline"
        onClick={() => {
          history.back();
        }}
        className="w-fit"
      >
        Back
      </Button>
      <h2 className="text-2xl leading-tight my-5">Start Processing</h2>
      <div className="flex flex-col">
        {specimen ? (
          <SpecimenCard
            specimen={specimen}
            onRemove={handleRemoveSpecimen}
            onStartProcessing={handleStartProcessing}
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
                  const barcode = (e.target as HTMLInputElement).value;

                  const { res, data } = await request(
                    routes.labs.specimen.get,
                    {
                      pathParams: {
                        id: barcode,
                      },
                    },
                  );

                  if (!res?.ok || !data) {
                    // Handle error accordingly
                    return;
                  }

                  setSpecimen(data);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Observations Section */}
      {!!specimen?.processing.length && !diagnosticReport && (
        <>
          <LabObservationQuestion
            question="Lab Observations"
            observations={observations}
            setObservations={setObservations}
            // disabled={!specimen || specimen?.processing.length > 0}
          />

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" size="lg">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              disabled={observations.length === 0}
              onClick={handleSubmitObservations}
            >
              Submit
            </Button>
          </div>
        </>
      )}
      <div className="border-l-[2.5px] border-gray-300 w-5 h-12 ms-8 last:hidden" />

      {/* Diagnostic Report Section */}
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
              referenceRange: "Dummy Ref range", // Replace with actual reference range if available
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
                    // Handle error accordingly
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
