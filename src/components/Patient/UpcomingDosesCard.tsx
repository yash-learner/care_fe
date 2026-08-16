import careConfig from "@careConfig";
import { Bell, ChevronDown } from "lucide-react";
import { Link } from "raviger";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { formatDoseWhen } from "@/components/Patient/formatDoseWhen";
import { PatientBadge } from "@/components/Patient/PatientBadge";

import { AlarmOccurrence } from "@/types/careReminders/careReminders";
import { hasNativeAlarmPlugin } from "@/Utils/capacitorAlarm";

interface UpcomingDosesCardProps {
  occurrences: AlarmOccurrence[];
}

export function UpcomingDosesCard({ occurrences }: UpcomingDosesCardProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const isNative = hasNativeAlarmPlugin();
  const apkUrl = careConfig.patientApkUrl;

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="flex flex-col gap-3 rounded-2xl border border-primary-200 bg-white p-4"
    >
      <section aria-labelledby="upcoming-doses-heading" className="contents">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-2 text-left"
            aria-expanded={open}
          >
            <Bell className="size-4 text-primary-700" strokeWidth={1.9} />
            <h3
              id="upcoming-doses-heading"
              className="min-w-0 flex-1 text-base font-bold text-gray-900"
            >
              {t("patient_home__upcoming_doses")}
            </h3>
            {occurrences.length > 0 && (
              <PatientBadge tone="primary">{occurrences.length}</PatientBadge>
            )}
            <ChevronDown
              className={cn(
                "size-4 shrink-0 text-gray-500 transition-transform",
                open && "rotate-180",
              )}
              strokeWidth={2}
              aria-hidden
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="flex flex-col gap-3">
          {occurrences.length === 0 ? (
            <p className="text-sm text-gray-600">
              {t("patient_home__no_reminders_yet")}
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

          <Link
            href="/patient/records?tab=prescriptions"
            className="text-xs font-semibold text-primary-700"
          >
            {t("patient_home__set_reminders_from_prescription")}
          </Link>
        </CollapsibleContent>
      </section>
    </Collapsible>
  );
}
