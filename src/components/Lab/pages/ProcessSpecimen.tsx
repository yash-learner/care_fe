import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { ResultTable } from "@/components/Common/ResultTable";
import {
  ProgressBarStep,
  ServiceRequestTimeline,
} from "@/components/Common/ServiceRequestTimeline";

import useAuthUser from "@/hooks/useAuthUser";

import routes from "@/Utils/request/api";
import mutate from "@/Utils/request/mutate";
import query from "@/Utils/request/query";
import request from "@/Utils/request/request";
import { DiagnosticReport } from "@/types/emr/diagnosticReport";
import { Specimen } from "@/types/emr/specimen";

import { BarcodeInput } from "../BarcodeInput";
import {
  DiagnosticReportForm,
  DiagnosticReportFormValues,
} from "../DiagnosticReportForm";
import { SpecimenCard } from "../SpecimenCard";

export const ProcessSpecimen = ({ specimenId }: { specimenId?: string }) => {
  const { id: currentUserId } = useAuthUser();
  const { t } = useTranslation();

  const [specimen, setSpecimen] = useState<Specimen>();
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport>();

  const steps: ProgressBarStep[] = [
    {
      label: "Specimen Verified",
      status: specimen?.received_at ? "completed" : "pending",
    },
    {
      label: "Enter Result",
      status:
        (specimen?.processing?.length ?? 0) > 0
          ? "completed"
          : specimen?.received_at
            ? "pending"
            : "notStarted",
    },
    {
      label: "Under Review",
      status:
        specimen?.report?.[0]?.id || diagnosticReport?.status === "preliminary"
          ? "completed"
          : (specimen?.processing?.length ?? 0) > 0
            ? "pending"
            : "notStarted",
    },
    {
      label: "Completed",
      status:
        diagnosticReport?.status === "preliminary"
          ? "completed"
          : specimen?.report?.[0]?.id
            ? "pending"
            : "notStarted",
    },
  ];

  const { data: specimenData } = useQuery({
    queryKey: ["specimen", specimenId],
    queryFn: query(routes.labs.specimen.get, {
      pathParams: {
        id: specimenId ?? "",
      },
    }),
    enabled: !!specimenId,
  });

  useEffect(() => {
    if (specimenData) {
      setSpecimen(specimenData);
    }
  }, [specimenData]);

  const handleRemoveSpecimen = () => {
    setSpecimen(undefined);
    setDiagnosticReport(undefined);
  };

  const { mutate: verifyDiagnosticReport, isPending } = useMutation({
    mutationFn: mutate(routes.labs.diagnosticReport.verify, {
      pathParams: { id: diagnosticReport?.id ?? "" },
    }),
    onSuccess: (data: DiagnosticReport) => {
      toast.success(t("verify_diagnostic_report_success"));
      setDiagnosticReport(data);
      setSpecimen(data.specimen[0]);
    },
  });

  const handleProcessingStarted = (updatedSpecimen: Specimen) => {
    setSpecimen(updatedSpecimen);
  };

  const { mutate: submitObservations, isPending: isPendingObservations } =
    useMutation({
      mutationFn: async (formData: DiagnosticReportFormValues) => {
        const observations = formData.observations;
        if (!specimen || observations.length === 0) {
          throw new Error("Specimen or observations are missing.");
        }

        const createReport = mutate(routes.labs.diagnosticReport.create);
        const reportData = await createReport({
          based_on: specimen.request.id,
          specimen: [specimen.id],
        });

        if (!reportData) {
          throw new Error("Failed to create diagnostic report.");
        }
        setDiagnosticReport(reportData);

        const submitObs = mutate(routes.labs.diagnosticReport.observations, {
          pathParams: { id: reportData.id },
        });

        const observationsData = await submitObs({
          observations: observations.map((obs) => {
            const numericValue = parseFloat(
              obs.value.value_quantity.value || "0",
            );

            const codeSystem =
              obs.value.value_quantity.code.system ||
              "http://unitsofmeasure.org";

            return {
              id: uuid(),
              main_code: obs.main_code,
              status: "final" as const,
              effective_datetime: new Date().toISOString(),
              data_entered_by_id: currentUserId,
              subject_type: "patient" as const,
              value: {
                value_quantity: {
                  code: {
                    code: obs.value.value_quantity.code.code,
                    system: codeSystem,
                    display: obs.value.value_quantity.code.display,
                  },
                  value: numericValue,
                },
              },
              value_type: "quantity",
              note: obs.note ?? "",
              created_by_id: currentUserId,
              updated_by_id: currentUserId,
            };
          }),
        });

        if (!observationsData) {
          throw new Error("Failed to submit observations.");
        }

        return observationsData;
      },
      onSuccess: (data: DiagnosticReport) => {
        setDiagnosticReport(data);
        toast.success(t("observations_submitted_successfully"));
      },
      onError: () => {
        toast.error(t("submit_observations_failed"));
      },
    });

  const handleDiagnosticReportFormSubmit = (
    values: DiagnosticReportFormValues,
  ) => {
    submitObservations(values);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row min-h-screen">
      <ServiceRequestTimeline steps={steps} />
      <div className="mx-auto max-w-5xl flex flex-col flex-1 p-6 lg:p-8">
        <Button
          variant="outline"
          onClick={() => {
            history.back();
          }}
          className="w-fit"
        >
          {t("back")}
        </Button>
        <h2 className="text-2xl leading-tight my-5">{t("start_processing")}</h2>
        <div className="flex flex-col">
          {specimen ? (
            <SpecimenCard
              specimen={specimen}
              onRemove={handleRemoveSpecimen}
              onStartProcessing={handleProcessingStarted}
            />
          ) : (
            <div className="space-y-2">
              <Label className="text-sm font-normal text-gray-900">
                {t("barcode")}
              </Label>
              <BarcodeInput
                className="text-center"
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    const barcode = (e.target as HTMLInputElement).value;

                    const { res, data } = await request(
                      routes.labs.specimen.get,
                      {
                        pathParams: { id: barcode },
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
          <DiagnosticReportForm
            question={t("lab_observations")}
            disabled={false}
            onSubmit={handleDiagnosticReportFormSubmit}
            isPending={isPendingObservations}
          />
        )}
        <div className="border-l-[2.5px] border-gray-300 w-5 h-12 ms-8 last:hidden" />

        {diagnosticReport && (
          <div className="bg-gray-50 border border-gray-300 rounded-sm shadow-sm p-2 space-y-2">
            <h2 className="text-base font-semibold text-gray-900">
              {t("test_results")}
            </h2>
            <ResultTable
              columns={[
                {
                  key: "parameter",
                  label: t("parameter"),
                  headerClass: "border-r border-gray-300",
                },
                {
                  key: "result",
                  label: t("result"),
                  headerClass: "border-r border-gray-300",
                },
                {
                  key: "unit",
                  label: t("unit"),
                  headerClass: "border-r border-gray-300",
                },
                {
                  key: "referenceRange",
                  label: t("reference_range"),
                  headerClass: "border-r border-gray-300",
                },
                { key: "remark", label: t("remark") },
              ]}
              data={diagnosticReport.result.map((observation) => ({
                parameter:
                  observation.main_code?.display ?? observation.main_code?.code,
                result: String(observation.value.value_quantity?.value ?? ""),
                unit: String(observation.value.value_quantity?.code.code ?? ""),
                referenceRange: "4.0 - 11.0",
                remark: observation.note,
              }))}
              isPending={isPendingObservations}
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
                  <span>{t("reject")}</span>
                </Button>
                <Button
                  onClick={() => {
                    verifyDiagnosticReport({ is_approved: true });
                  }}
                  variant="primary"
                  size="sm"
                  className="gap-2"
                >
                  {isPending ? (
                    <>
                      <CareIcon
                        icon="l-spinner"
                        className="mr-2 h-4 w-4 animate-spin"
                      />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircledIcon className="h-4 w-4 text-white" />
                      {t("approve")}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
