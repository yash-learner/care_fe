import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  ALARM_CLOCK_PARTS,
  PatientAlarmClock,
} from "@/types/careReminders/careReminders";

export function hhmm(value: string): string {
  return value.slice(0, 5);
}

export function clockToInputs(clock: PatientAlarmClock) {
  return {
    morning_at: hhmm(clock.morning_at),
    noon_at: hhmm(clock.noon_at),
    evening_at: hhmm(clock.evening_at),
    night_at: hhmm(clock.night_at),
  };
}

export type AlarmClockInputs = ReturnType<typeof clockToInputs>;

interface AlarmClockFieldsProps {
  times: AlarmClockInputs;
  onChange: (times: AlarmClockInputs) => void;
}

export function AlarmClockFields({ times, onChange }: AlarmClockFieldsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {ALARM_CLOCK_PARTS.map((part) => {
        const field = `${part}_at` as keyof AlarmClockInputs;
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
              onChange={(event) =>
                onChange({ ...times, [field]: hhmm(event.target.value) })
              }
            />
          </div>
        );
      })}
    </div>
  );
}

export function AlarmBellIcon({ armed }: { armed: boolean }) {
  return (
    <Bell
      className={armed ? "size-5 text-primary-700" : "size-5 text-gray-500"}
      strokeWidth={1.9}
      fill={armed ? "currentColor" : "none"}
    />
  );
}
