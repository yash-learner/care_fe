import { Capacitor, registerPlugin } from "@capacitor/core";

import careConfig from "@careConfig";

import { AlarmCalendar } from "@/types/careReminders/careReminders";

interface NativeAlarmPlugin {
  sync: (options: AlarmCalendar & { api_url: string }) => Promise<void>;
  cancel: () => Promise<void>;
  requestPermissions: () => Promise<void>;
}

const Alarm = registerPlugin<NativeAlarmPlugin>("Alarm");

/** True only inside a Capacitor WebView, not the browser patient portal. */
export function isCapacitorRuntime(): boolean {
  return Capacitor.isNativePlatform();
}

/** True inside the patient APK (Alarm plugin is bundled with this app). */
export function hasNativeAlarmPlugin(): boolean {
  return isCapacitorRuntime();
}

export async function syncNativeAlarms(calendar: AlarmCalendar): Promise<void> {
  if (!hasNativeAlarmPlugin()) {
    return;
  }
  const apiUrl = careConfig.apiUrl || window.location.origin;
  try {
    await Alarm.requestPermissions();
  } catch {
    // User can still get inexact alarms if exact permission is denied.
  }
  await Alarm.sync({
    ...calendar,
    api_url: apiUrl.replace(/\/$/, ""),
  });
}

export async function cancelNativeAlarms(): Promise<void> {
  if (!hasNativeAlarmPlugin()) {
    return;
  }
  try {
    await Alarm.cancel();
  } catch {
    // Native side still clears on the next successful sync.
  }
}
