import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import { usePatientContext } from "@/hooks/usePatientUser";

import {
  ALARM_CLOCK_PARTS,
  PatientAlarmClock,
  PatientAlarmClockList,
} from "@/types/careReminders/careReminders";
import careRemindersApi from "@/types/careReminders/careRemindersApi";
import mutate from "@/Utils/request/mutate";
import { callApi } from "@/Utils/request/query";

interface AlarmTimesCardProps {
  patientId?: string;
}

function hhmm(value: string): string {
  return value.slice(0, 5);
}

function clockToInputs(clock: PatientAlarmClock) {
  return {
    morning_at: hhmm(clock.morning_at),
    noon_at: hhmm(clock.noon_at),
    evening_at: hhmm(clock.evening_at),
    night_at: hhmm(clock.night_at),
  };
}

export function AlarmTimesCard({ patientId }: AlarmTimesCardProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { tokenData } = usePatientContext();
  const token = tokenData?.token;
  const [draft, setDraft] = useState<{
    patientId: string;
    times: ReturnType<typeof clockToInputs>;
  } | null>(null);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["care-reminders", "clocks", token],
    queryFn: ({ signal }) =>
      callApi(careRemindersApi.clocks, {
        headers: { Authorization: `Bearer ${token}` },
        silent: true,
        signal,
      }),
    enabled: !!token,
    retry: false,
  });

  const clock = useMemo(() => {
    const clocks = data?.clocks ?? [];
    return (
      clocks.find((item) => item.patient_id === patientId) ?? clocks[0] ?? null
    );
  }, [data?.clocks, patientId]);

  const times =
    clock && draft?.patientId === clock.patient_id
      ? draft.times
      : clock
        ? clockToInputs(clock)
        : null;

  const { mutate: saveClocks, isPending } = useMutation({
    mutationFn: mutate(careRemindersApi.updateClocks, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    onSuccess: (result) => {
      setDraft(null);
      const { clock: nextClock, ...calendar } = result;
      queryClient.setQueryData(["care-reminders", "sync", token], calendar);
      queryClient.setQueryData(
        ["care-reminders", "clocks", token],
        (current: PatientAlarmClockList | undefined) => {
          if (!current) {
            return { clocks: [nextClock] };
          }
          return {
            clocks: current.clocks.some(
              (item) => item.patient_id === nextClock.patient_id,
            )
              ? current.clocks.map((item) =>
                  item.patient_id === nextClock.patient_id ? nextClock : item,
                )
              : [...current.clocks, nextClock],
          };
        },
      );
      toast.success(t("patient_profile__alarm_times_saved"));
    },
  });

  if (!token || isError) {
    return null;
  }

  if (isLoading) {
    return <Skeleton className="h-56 w-full rounded-2xl" />;
  }

  if (!isSuccess || !clock || !times) {
    return null;
  }

  const handleSave = () => {
    saveClocks({
      patient_id: clock.patient_id,
      ...times,
    });
  };

  return (
    <section
      className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4"
      aria-labelledby="alarm-times-heading"
      data-cy="alarm-times"
    >
      <div className="flex items-center gap-2">
        <Bell className="size-4 text-primary-700" strokeWidth={1.9} />
        <h3
          id="alarm-times-heading"
          className="text-base font-bold text-gray-900"
        >
          {t("patient_profile__alarm_times")}
        </h3>
      </div>
      <p className="text-sm text-gray-600">
        {t("patient_profile__alarm_times_help")}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ALARM_CLOCK_PARTS.map((part) => {
          const field = `${part}_at` as keyof typeof times;
          return (
            <div key={part} className="flex flex-col gap-1.5">
              <Label htmlFor={`alarm-${part}`}>
                {t(`patient_profile__alarm_${part}`)}
              </Label>
              <Input
                id={`alarm-${part}`}
                type="time"
                step={60}
                className="min-h-11"
                value={times[field]}
                onClick={(event) => {
                  try {
                    event.currentTarget.showPicker();
                  } catch {
                    // Chromium-only; the native time control still works.
                  }
                }}
                onChange={(event) => {
                  if (!clock || !times) {
                    return;
                  }
                  setDraft({
                    patientId: clock.patient_id,
                    times: {
                      ...times,
                      [field]: hhmm(event.target.value),
                    },
                  });
                }}
              />
            </div>
          );
        })}
      </div>
      <Button
        className="min-h-11 w-full"
        onClick={handleSave}
        disabled={
          isPending ||
          !times.morning_at ||
          !times.noon_at ||
          !times.evening_at ||
          !times.night_at
        }
      >
        {t("save")}
      </Button>
    </section>
  );
}
