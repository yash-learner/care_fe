import { useEffect } from "react";

import { usePatientContext } from "@/hooks/usePatientUser";
import careRemindersApi from "@/types/careReminders/careRemindersApi";
import { isCapacitorRuntime, syncNativeAlarms } from "@/Utils/capacitorAlarm";
import { callApi } from "@/Utils/request/query";

/**
 * On Capacitor only: rebuild the Django dose calendar and hand it to the
 * native Alarm plugin. No-ops in the browser and when the plugin is absent.
 */
export function usePatientAlarmSync() {
  const { tokenData } = usePatientContext();
  const token = tokenData?.token;

  useEffect(() => {
    if (!isCapacitorRuntime() || !token) {
      return;
    }

    const abort = new AbortController();

    const run = async () => {
      try {
        const calendar = await callApi(careRemindersApi.sync, {
          headers: { Authorization: `Bearer ${token}` },
          body: {},
          silent: true,
          signal: abort.signal,
        });
        if (abort.signal.aborted) {
          return;
        }
        await syncNativeAlarms(calendar);
      } catch {
        // Plugin not installed, native bridge missing, or request aborted.
      }
    };

    void run();
    return () => abort.abort();
  }, [token]);
}
