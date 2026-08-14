import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { usePatientContext } from "@/hooks/usePatientUser";
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
