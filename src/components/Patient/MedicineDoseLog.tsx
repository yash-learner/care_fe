import { useTranslation } from "react-i18next";

import { Skeleton } from "@/components/ui/skeleton";

import { formatDoseWhen } from "@/components/Patient/formatDoseWhen";
import { PatientBadge } from "@/components/Patient/PatientBadge";

import {
  AlarmOccurrence,
  DoseStatus,
} from "@/types/careReminders/careReminders";

const UPCOMING_STATUSES = new Set<DoseStatus>(["pending", "sent"]);

const STATUS_TONE = {
  upcoming: "primary",
  taken: "success",
  skipped: "neutral",
  missed: "danger",
} as const;

function displayStatus(
  status: DoseStatus | undefined,
): keyof typeof STATUS_TONE {
  if (status === "taken" || status === "skipped" || status === "missed") {
    return status;
  }
  return "upcoming";
}

interface MedicineDoseLogProps {
  doses: AlarmOccurrence[];
  armed: boolean;
  loading?: boolean;
}

export function MedicineDoseLog({
  doses,
  armed,
  loading = false,
}: MedicineDoseLogProps) {
  const { t } = useTranslation();
  const upcoming = doses.filter(
    (dose) => !dose.status || UPCOMING_STATUSES.has(dose.status),
  );
  const earlier = [...doses]
    .filter((dose) => dose.status && !UPCOMING_STATUSES.has(dose.status))
    .reverse();

  if (loading && !doses.length) {
    return <Skeleton className="h-16 w-full rounded-xl" />;
  }

  if (!doses.length) {
    return (
      <p className="text-xs text-gray-600">
        {armed ? t("patient_dose__none") : t("patient_dose__turn_on_to_track")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {upcoming.length > 0 && (
        <DoseGroup heading={t("patient_dose__upcoming")} doses={upcoming} />
      )}
      {earlier.length > 0 && (
        <DoseGroup heading={t("patient_dose__earlier")} doses={earlier} />
      )}
    </div>
  );
}

function DoseGroup({
  heading,
  doses,
}: {
  heading: string;
  doses: AlarmOccurrence[];
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.09em] text-gray-500">
        {heading}
      </span>
      <ul className="flex flex-col gap-1.5">
        {doses.map((dose) => {
          const status = displayStatus(dose.status);
          return (
            <li
              key={dose.external_id}
              className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2"
            >
              <span className="min-w-0 truncate text-xs text-gray-700">
                {formatDoseWhen(dose.scheduled_at)}
                {dose.body ? ` · ${dose.body}` : ""}
              </span>
              <PatientBadge tone={STATUS_TONE[status]}>
                {t(`patient_dose__${status}`)}
              </PatientBadge>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
