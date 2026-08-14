import careConfig from "@careConfig";
import dayjs from "dayjs";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

import { PatientBadge } from "@/components/Patient/PatientBadge";

import { AlarmOccurrence } from "@/types/careReminders/careReminders";
import { isCapacitorRuntime } from "@/Utils/capacitorAlarm";

interface UpcomingDosesCardProps {
  occurrences: AlarmOccurrence[];
}

function formatDoseWhen(scheduledAt: string): string {
  const at = dayjs(scheduledAt);
  if (at.isSame(dayjs(), "day")) {
    return at.format("h:mm A");
  }
  return at.format("ddd D MMM, h:mm A");
}

export function UpcomingDosesCard({ occurrences }: UpcomingDosesCardProps) {
  const { t } = useTranslation();
  const isNative = isCapacitorRuntime();
  const apkUrl = careConfig.patientApkUrl;

  return (
    <section
      className="flex flex-col gap-3 rounded-2xl border border-primary-200 bg-white p-4"
      aria-labelledby="upcoming-doses-heading"
    >
      <div className="flex items-center gap-2">
        <Bell className="size-4 text-primary-700" strokeWidth={1.9} />
        <h3
          id="upcoming-doses-heading"
          className="text-base font-bold text-gray-900"
        >
          {t("patient_home__upcoming_doses")}
        </h3>
      </div>

      {occurrences.length === 0 ? (
        <p className="text-sm text-gray-600">
          {t("patient_home__no_upcoming_doses")}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {occurrences.map((occurrence) => (
            <li
              key={occurrence.external_id}
              className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">
                  {occurrence.medication_name}
                </p>
                <p className="truncate text-xs text-gray-600">
                  {occurrence.body}
                </p>
              </div>
              <PatientBadge tone="primary">
                {formatDoseWhen(occurrence.scheduled_at)}
              </PatientBadge>
            </li>
          ))}
        </ul>
      )}

      {isNative ? (
        <p className="text-xs font-semibold text-primary-800">
          {t("patient_home__alarms_on_device")}
        </p>
      ) : (
        <div className="flex flex-col gap-2 rounded-xl border border-primary-100 bg-primary-50 px-3 py-2.5">
          <p className="text-xs font-semibold text-primary-800">
            {t("patient_home__alarms_apk_note")}
          </p>
          {apkUrl ? (
            <Button className="min-h-11 w-full" asChild>
              <a href={apkUrl} target="_blank" rel="noopener noreferrer">
                {t("patient_home__install_apk")}
              </a>
            </Button>
          ) : (
            <p className="text-xs text-primary-800">
              {t("patient_home__install_apk_later")}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
