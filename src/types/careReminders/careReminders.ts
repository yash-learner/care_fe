export interface AlarmOccurrence {
  id: number;
  external_id: string;
  scheduled_at: string;
  title: string;
  body: string;
  medication_name: string;
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

export interface AlarmSyncResponse extends AlarmCalendar {
  ok: boolean;
  patients?: number;
  medication_requests?: number;
  occurrences_created?: number;
}

export interface CapacitorAlarmPlugin {
  sync: (calendar: AlarmCalendar) => Promise<void>;
  cancel?: () => Promise<void>;
}

export interface CapacitorRuntime {
  Plugins?: {
    Alarm?: CapacitorAlarmPlugin;
  };
  isNativePlatform?: () => boolean;
}
