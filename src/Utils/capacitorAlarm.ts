import {
  AlarmCalendar,
  CapacitorRuntime,
} from "@/types/careReminders/careReminders";

function capacitor(): CapacitorRuntime | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  return window.Capacitor;
}

/** True only inside a Capacitor WebView, not the browser patient portal. */
export function isCapacitorRuntime(): boolean {
  const runtime = capacitor();
  if (!runtime) {
    return false;
  }
  if (typeof runtime.isNativePlatform === "function") {
    return runtime.isNativePlatform();
  }
  return true;
}

export async function syncNativeAlarms(calendar: AlarmCalendar): Promise<void> {
  const alarm = capacitor()?.Plugins?.Alarm;
  if (!alarm?.sync) {
    return;
  }
  await alarm.sync(calendar);
}
