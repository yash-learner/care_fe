import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import ConfirmActionDialog from "@/components/Common/ConfirmActionDialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

import {
  AlarmClockFields,
  clockToInputs,
} from "@/components/Patient/AlarmClockFields";

import { cachePatientReminderState } from "@/hooks/usePatientAlarmSync";
import { usePatientContext } from "@/hooks/usePatientUser";

import {
  PatientAlarmArmBody,
  PatientAlarmClockResponse,
  PatientAlarmDisarmBody,
} from "@/types/careReminders/careReminders";
import careRemindersApi from "@/types/careReminders/careRemindersApi";
import mutate from "@/Utils/request/mutate";
import { callApi } from "@/Utils/request/query";

interface PrescriptionAlarmSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicationId: string;
  medicationName: string;
  patientId?: string;
}

export function PrescriptionAlarmSheet({
  open,
  onOpenChange,
  medicationId,
  medicationName,
  patientId,
}: PrescriptionAlarmSheetProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { tokenData } = usePatientContext();
  const token = tokenData?.token;
  const [draft, setDraft] = useState<ReturnType<typeof clockToInputs> | null>(
    null,
  );
  const [confirmAll, setConfirmAll] = useState(false);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["care-reminders", "clocks", token],
    queryFn: ({ signal }) =>
      callApi(careRemindersApi.clocks, {
        headers: { Authorization: `Bearer ${token}` },
        silent: true,
        signal,
      }),
    enabled: !!token && open,
    retry: false,
  });

  const clock = useMemo(() => {
    const clocks = data?.clocks ?? [];
    return (
      clocks.find((item) => item.patient_id === patientId) ?? clocks[0] ?? null
    );
  }, [data?.clocks, patientId]);

  const times = draft ?? (clock ? clockToInputs(clock) : null);
  const armed = (data?.armed_medication_ids ?? []).includes(medicationId);
  const timesReady = Boolean(
    times?.morning_at && times.noon_at && times.evening_at && times.night_at,
  );

  const applyResult = (result: PatientAlarmClockResponse) => {
    setDraft(null);
    cachePatientReminderState(queryClient, token, result);
  };

  const { mutate: armReminders, isPending: isArming } = useMutation<
    PatientAlarmClockResponse,
    Error,
    PatientAlarmArmBody
  >({
    mutationFn: (body) =>
      mutate(careRemindersApi.arm, {
        headers: { Authorization: `Bearer ${token}` },
      })(body) as Promise<PatientAlarmClockResponse>,
    onSuccess: (result) => {
      applyResult(result);
      toast.success(
        armed
          ? t("patient_prescription__times_saved")
          : t("patient_prescription__reminders_on"),
      );
    },
  });

  const { mutate: disarmReminders, isPending: isDisarming } = useMutation<
    PatientAlarmClockResponse,
    Error,
    PatientAlarmDisarmBody
  >({
    mutationFn: (body) =>
      mutate(careRemindersApi.disarm, {
        headers: { Authorization: `Bearer ${token}` },
      })(body) as Promise<PatientAlarmClockResponse>,
    onSuccess: (result, variables) => {
      applyResult(result);
      toast.success(
        variables.medication_request_id
          ? t("patient_prescription__reminders_off")
          : t("patient_prescription__all_reminders_off"),
      );
      if (!variables.medication_request_id) {
        onOpenChange(false);
      }
    },
  });

  const isPending = isArming || isDisarming;

  const handleSave = () => {
    if (!times) {
      return;
    }
    armReminders({
      medication_request_id: medicationId,
      ...times,
    });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="mx-auto max-h-[85dvh] max-w-120 overflow-y-auto rounded-t-3xl px-5 pb-6 pt-3"
        >
          <span
            aria-hidden
            className="mx-auto mb-4 block h-1 w-10 rounded-full bg-gray-300"
          />
          <SheetHeader className="space-y-1 text-left">
            <SheetTitle className="text-xl font-bold tracking-tight">
              {t("patient_prescription__reminders")}
            </SheetTitle>
            <SheetDescription className="text-sm">
              {t("patient_prescription__reminders_help", {
                name: medicationName,
              })}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 flex flex-col gap-4">
            {!token || isError ? (
              <p className="text-sm text-gray-600">
                {t("patient_prescription__reminders_unavailable")}
              </p>
            ) : isLoading ? (
              <Skeleton className="h-40 w-full rounded-2xl" />
            ) : isSuccess && clock && times ? (
              <>
                <AlarmClockFields times={times} onChange={setDraft} />
                <Button
                  className="min-h-11 w-full"
                  onClick={handleSave}
                  disabled={isPending || !timesReady}
                >
                  {armed
                    ? t("patient_prescription__save_times")
                    : t("patient_prescription__turn_on")}
                </Button>
                {armed && (
                  <Button
                    variant="outline"
                    className="min-h-11 w-full"
                    disabled={isPending}
                    onClick={() =>
                      disarmReminders({
                        medication_request_id: medicationId,
                      })
                    }
                  >
                    {t("patient_prescription__cancel_this")}
                  </Button>
                )}
                {(data?.armed_medication_ids?.length ?? 0) > 0 && (
                  <Button
                    variant="ghost"
                    className="min-h-11 w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                    disabled={isPending}
                    onClick={() => setConfirmAll(true)}
                  >
                    {t("patient_prescription__cancel_all")}
                  </Button>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-600">
                {t("patient_prescription__reminders_unavailable")}
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmActionDialog
        open={confirmAll}
        onOpenChange={setConfirmAll}
        title={t("patient_prescription__cancel_all")}
        description={t("patient_prescription__cancel_all_confirm")}
        confirmText={t("patient_prescription__cancel_all")}
        variant="destructive"
        disabled={isPending}
        onConfirm={() => {
          setConfirmAll(false);
          disarmReminders({});
        }}
      />
    </>
  );
}
