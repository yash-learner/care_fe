import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import ConfirmActionDialog from "@/components/Common/ConfirmActionDialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

import {
  AlarmClockFields,
  clockToInputs,
} from "@/components/Patient/AlarmClockFields";

import { cachePatientReminderState } from "@/hooks/usePatientAlarmSync";
import { usePatientContext } from "@/hooks/usePatientUser";

import {
  PatientAlarmArmBody,
  PatientAlarmClockPatch,
  PatientAlarmClockResponse,
  PatientAlarmDisarmBody,
} from "@/types/careReminders/careReminders";
import careRemindersApi from "@/types/careReminders/careRemindersApi";
import mutate from "@/Utils/request/mutate";
import { callApi } from "@/Utils/request/query";

export interface PrescriptionAlarmMedicine {
  id: string;
  name: string;
}

interface PrescriptionAlarmSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicines: PrescriptionAlarmMedicine[];
  patientId?: string;
}

export function PrescriptionAlarmSheet({
  open,
  onOpenChange,
  medicines,
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
  const armedIds = data?.armed_medication_ids ?? [];
  const timesReady = Boolean(
    times?.morning_at && times.noon_at && times.evening_at && times.night_at,
  );
  const clockPatientId = patientId || clock?.patient_id;

  const applyResult = (result: PatientAlarmClockResponse) => {
    setDraft(null);
    cachePatientReminderState(queryClient, token, result);
  };

  const { mutate: saveTimes, isPending: isSavingTimes } = useMutation<
    PatientAlarmClockResponse,
    Error,
    PatientAlarmClockPatch
  >({
    mutationFn: (body) =>
      mutate(careRemindersApi.updateClocks, {
        headers: { Authorization: `Bearer ${token}` },
      })(body) as Promise<PatientAlarmClockResponse>,
    onSuccess: (result) => {
      applyResult(result);
      toast.success(t("patient_prescription__times_saved"));
    },
  });

  const { mutate: armReminders, isPending: isArming } = useMutation<
    PatientAlarmClockResponse,
    Error,
    PatientAlarmArmBody
  >({
    mutationFn: (body) =>
      mutate(careRemindersApi.arm, {
        headers: { Authorization: `Bearer ${token}` },
      })(body) as Promise<PatientAlarmClockResponse>,
    onSuccess: (result, variables) => {
      applyResult(result);
      const medicine = medicines.find(
        (item) => item.id === variables.medication_request_id,
      );
      toast.success(
        t("patient_prescription__reminders_on", {
          name: medicine?.name ?? "",
        }),
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

  const isPending = isSavingTimes || isArming || isDisarming;

  const handleSaveTimes = () => {
    if (!times || !clockPatientId) {
      return;
    }
    saveTimes({
      patient_id: clockPatientId,
      ...times,
    });
  };

  const handleToggle = (medicationId: string, next: boolean) => {
    if (!times) {
      return;
    }
    if (next) {
      armReminders({
        medication_request_id: medicationId,
        ...times,
      });
      return;
    }
    disarmReminders({ medication_request_id: medicationId });
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
              {t("patient_prescription__reminders_help")}
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
                  onClick={handleSaveTimes}
                  disabled={isPending || !timesReady || !clockPatientId}
                >
                  {t("patient_prescription__save_times")}
                </Button>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.09em] text-gray-500">
                    {t("patient_prescription__medicines")}
                  </span>
                  {medicines.map((medicine) => {
                    const armed = armedIds.includes(medicine.id);
                    return (
                      <div
                        key={medicine.id}
                        className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2"
                      >
                        <Label
                          htmlFor={`arm-${medicine.id}`}
                          className="min-w-0 flex-1 text-sm font-semibold text-gray-900"
                        >
                          {medicine.name}
                        </Label>
                        <Switch
                          id={`arm-${medicine.id}`}
                          checked={armed}
                          disabled={isPending || !timesReady}
                          onCheckedChange={(next) =>
                            handleToggle(medicine.id, next)
                          }
                        />
                      </div>
                    );
                  })}
                </div>

                {armedIds.length > 0 && (
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
