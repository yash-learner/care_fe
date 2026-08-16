import { QueryClient, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { usePatientContext } from "@/hooks/usePatientUser";
import { PatientAlarmClockResponse } from "@/types/careReminders/careReminders";
import careRemindersApi from "@/types/careReminders/careRemindersApi";
import { isCapacitorRuntime, syncNativeAlarms } from "@/Utils/capacitorAlarm";
import { callApi } from "@/Utils/request/query";

/** Rebuild the Django dose calendar for this OTP session (web and Capacitor). */
export function usePatientDoseCalendar() {
  const { tokenData } = usePatientContext();
  const token = tokenData?.token;

  return useQuery({
    queryKey: ["care-reminders", "sync", token],
    queryFn: ({ signal }) =>
      callApi(careRemindersApi.sync, {
        headers: { Authorization: `Bearer ${token}` },
        body: {},
        silent: true,
        signal,
      }),
    enabled: !!token,
    retry: false,
    staleTime: 60_000,
  });
}

export function cachePatientReminderState(
  queryClient: QueryClient,
  token: string | undefined,
  result: PatientAlarmClockResponse,
) {
  const { clock: nextClock, ...calendar } = result;
  queryClient.setQueryData(["care-reminders", "sync", token], calendar);
  queryClient.setQueryData(["care-reminders", "clocks", token], {
    clocks: result.clocks?.length
      ? result.clocks
      : nextClock
        ? [nextClock]
        : [],
    armed_medication_ids: result.armed_medication_ids ?? [],
  });
  if (isCapacitorRuntime()) {
    void syncNativeAlarms(calendar);
  }
}

/**
 * On Capacitor: after the calendar loads, hand it to Alarm.sync.
 * On the web the query still runs so Home can list upcoming doses.
 */
export function usePatientAlarmSync() {
  const { data } = usePatientDoseCalendar();

  useEffect(() => {
    if (!isCapacitorRuntime() || !data) {
      return;
    }
    void syncNativeAlarms(data);
  }, [data]);
}
