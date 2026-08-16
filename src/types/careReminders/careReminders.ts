export interface AlarmOccurrence {
  id: number;
  external_id: string;
  scheduled_at: string;
  title: string;
  body: string;
  medication_name: string;
  patient_id: string;
  patient_name: string;
  day_part: string;
  take_path: string;
  skip_path: string;
  snooze_path: string;
  fired_path: string;
}

export interface AlarmCalendar {
  generated_at: string;
  snooze_minutes: number;
  calendar_path: string;
  occurrences: AlarmOccurrence[];
}

export const ALARM_CLOCK_PARTS = [
  "morning",
  "noon",
  "evening",
  "night",
] as const;

export type AlarmClockPart = (typeof ALARM_CLOCK_PARTS)[number];

export interface PatientAlarmClock {
  patient_id: string;
  patient_name: string;
  time_zone: string;
  morning_at: string;
  noon_at: string;
  evening_at: string;
  night_at: string;
}

export interface AlarmSyncResponse extends AlarmCalendar {
  ok: boolean;
  patients?: number;
  medication_requests?: number;
  occurrences_created?: number;
  armed_medication_ids?: string[];
  clocks?: PatientAlarmClock[];
}

export interface PatientAlarmClockList {
  clocks: PatientAlarmClock[];
  armed_medication_ids: string[];
}

export interface PatientAlarmClockPatch {
  patient_id: string;
  morning_at?: string;
  noon_at?: string;
  evening_at?: string;
  night_at?: string;
}

export interface PatientAlarmArmBody {
  medication_request_id: string;
  morning_at?: string;
  noon_at?: string;
  evening_at?: string;
  night_at?: string;
}

export interface PatientAlarmDisarmBody {
  medication_request_id?: string;
}

export interface PatientAlarmClockResponse extends AlarmSyncResponse {
  clock: PatientAlarmClock;
}

export interface CapacitorAlarmPlugin {
  sync: (calendar: AlarmCalendar & { api_url?: string }) => Promise<void>;
  cancel: () => Promise<void>;
  requestPermissions?: () => Promise<void>;
}

export interface CapacitorRuntime {
  Plugins?: {
    Alarm?: CapacitorAlarmPlugin;
  };
  isNativePlatform?: () => boolean;
}
