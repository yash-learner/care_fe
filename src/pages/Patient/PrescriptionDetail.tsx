import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ChevronDown, Pill } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

import { DosageInstructionList } from "@/components/Medicine/DosageInstructionList";
import {
  formatDosage,
  formatDuration,
  formatSig,
} from "@/components/Medicine/utils";
import { AlarmBellIcon } from "@/components/Patient/AlarmClockFields";
import { MedicineDoseLog } from "@/components/Patient/MedicineDoseLog";
import { PatientAppShell } from "@/components/Patient/PatientAppShell";
import {
  PatientBadge,
  type PatientBadgeTone,
} from "@/components/Patient/PatientBadge";
import { PrescriptionAlarmSheet } from "@/components/Patient/PrescriptionAlarmSheet";

import { usePatientContext } from "@/hooks/usePatientUser";

import query, { callApi } from "@/Utils/request/query";
import { formatName } from "@/Utils/utils";
import { AlarmOccurrence } from "@/types/careReminders/careReminders";
import careRemindersApi from "@/types/careReminders/careRemindersApi";
import {
  displayMedicationName,
  fhirDosageToFrequencyValue,
  INACTIVE_MEDICATION_STATUSES,
  MedicationRequestDosageInstruction,
  MedicationRequestRead,
} from "@/types/emr/medicationRequest/medicationRequest";
import patientPortalApi from "@/types/emr/patientPortal/patientPortalApi";
import { PrescriptionRead } from "@/types/emr/prescription/prescription";

/**
 * The backend status set is wider than the frontend enum (`on_hold`, `ended`,
 * `stopped`, …), so callers fall back to `neutral` for anything unmapped.
 */
const PRESCRIPTION_BADGE_TONES: Record<string, PatientBadgeTone> = {
  active: "success",
  completed: "info",
  cancelled: "danger",
};

function PrescriptionSummary({
  prescription,
}: {
  prescription: PrescriptionRead;
}) {
  const { t } = useTranslation();

  const fields: [string, string | null | undefined][] = [
    [
      t("prescribed_on"),
      dayjs(prescription.created_date).format("DD MMM YYYY"),
    ],
    [t("facility"), prescription.encounter?.facility?.name],
    [t("patient"), prescription.encounter?.patient?.name],
    [t("name"), prescription.name],
  ];

  return (
    <div className="flex flex-col gap-2.5 rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-bold text-gray-900">
          {formatName(prescription.prescribed_by)}
        </span>
        <PatientBadge
          tone={PRESCRIPTION_BADGE_TONES[prescription.status] ?? "neutral"}
        >
          {t(prescription.status)}
        </PatientBadge>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {fields.map(
          ([label, value]) =>
            value && (
              <div key={label} className="flex flex-col">
                <span className="text-xs text-gray-500">{label}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {value}
                </span>
              </div>
            ),
        )}
      </div>
    </div>
  );
}

function DosageStep({
  instruction,
}: {
  instruction: MedicationRequestDosageInstruction;
}) {
  const frequency = fhirDosageToFrequencyValue(instruction);
  const dose = [formatDosage(instruction), formatSig(instruction)]
    .filter(Boolean)
    .join(" · ");
  const detail = [
    formatDuration(instruction),
    ...(instruction.additional_instruction ?? []).map((code) => code.display),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex items-start justify-between gap-2.5">
      <div className="flex min-w-0 flex-col gap-0.5">
        {dose && <span className="text-xs text-gray-600">{dose}</span>}
        {detail && <span className="text-xs text-gray-600">{detail}</span>}
      </div>
      {frequency && (
        <span className="shrink-0 rounded-lg bg-gray-100 px-2.5 py-1 font-mono text-xs font-bold text-gray-900">
          {frequency}
        </span>
      )}
    </div>
  );
}

function isSchedulableMedication(medication: MedicationRequestRead): boolean {
  if (
    INACTIVE_MEDICATION_STATUSES.includes(
      medication.status as (typeof INACTIVE_MEDICATION_STATUSES)[number],
    )
  ) {
    return false;
  }
  return !(medication.dosage_instruction ?? []).some(
    (item) => item.as_needed_boolean,
  );
}

function MedicineCard({
  medication,
  armed,
  doses,
  dosesLoading,
}: {
  medication: MedicationRequestRead;
  armed: boolean;
  doses: AlarmOccurrence[];
  dosesLoading: boolean;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // A tapering course carries more than one instruction; every step is rendered
  // so the regimen is never truncated to its first step.
  const instructions = medication.dosage_instruction ?? [];
  const isInactive = INACTIVE_MEDICATION_STATUSES.includes(
    medication.status as (typeof INACTIVE_MEDICATION_STATUSES)[number],
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 rounded-2xl border border-gray-200 bg-white px-4 py-3.5",
        isInactive && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-2.5">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-start gap-2 text-left"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <ChevronDown
            className={cn(
              "mt-1 size-4 shrink-0 text-gray-500 transition-transform",
              open && "rotate-180",
            )}
            strokeWidth={2}
            aria-hidden
          />
          <span className="min-w-0 text-base font-bold text-gray-900">
            {displayMedicationName(medication)}
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          {armed && (
            <PatientBadge tone="primary">
              {t("patient_prescription__alarm_on")}
            </PatientBadge>
          )}
          {isInactive && (
            <PatientBadge tone="neutral">{t(medication.status)}</PatientBadge>
          )}
        </div>
      </div>
      <DosageInstructionList
        instructions={instructions}
        gap="sm"
        renderItem={(instruction) => <DosageStep instruction={instruction} />}
      />
      {medication.note && (
        <span className="text-xs text-gray-600">
          <span className="font-semibold">{t("note")}:</span> {medication.note}
        </span>
      )}
      {open && (
        <MedicineDoseLog doses={doses} armed={armed} loading={dosesLoading} />
      )}
    </div>
  );
}

export default function PrescriptionDetail({ id }: { id: string }) {
  const { t } = useTranslation();
  const { tokenData, selectedPatient } = usePatientContext();
  const [alarmOpen, setAlarmOpen] = useState(false);

  const { data: prescription } = useQuery({
    queryKey: ["portal-prescription", id],
    queryFn: query(patientPortalApi.getPrescription, {
      pathParams: { id },
      headers: { Authorization: `Bearer ${tokenData?.token}` },
    }),
    enabled: !!tokenData?.token,
  });

  const { data: reminderState } = useQuery({
    queryKey: ["care-reminders", "clocks", tokenData?.token],
    queryFn: ({ signal }) =>
      callApi(careRemindersApi.clocks, {
        headers: { Authorization: `Bearer ${tokenData?.token}` },
        silent: true,
        signal,
      }),
    enabled: !!tokenData?.token,
    retry: false,
  });

  const { data: doseHistory, isLoading: dosesLoading } = useQuery({
    queryKey: ["care-reminders", "doses", tokenData?.token],
    queryFn: ({ signal }) =>
      callApi(careRemindersApi.doses, {
        headers: { Authorization: `Bearer ${tokenData?.token}` },
        silent: true,
        signal,
      }),
    enabled: !!tokenData?.token,
    retry: false,
  });

  const armedIds = reminderState?.armed_medication_ids ?? [];
  const dosesByMedicine = (doseHistory?.occurrences ?? []).reduce(
    (groups: Record<string, AlarmOccurrence[]>, dose) => {
      const key = dose.medication_request_id;
      if (!key) {
        return groups;
      }
      groups[key] = [...(groups[key] ?? []), dose];
      return groups;
    },
    {},
  );

  // Entries marked entered_in_error are void records and should never reach the patient.
  const medications = (prescription?.medications ?? []).filter(
    (medication) => medication.status !== "entered_in_error",
  );
  const reminderMedicines = medications
    .filter(isSchedulableMedication)
    .map((medication) => ({
      id: medication.id,
      name: displayMedicationName(medication),
    }));
  const anyRemindersOn = reminderMedicines.some((medicine) =>
    armedIds.includes(medicine.id),
  );

  return (
    <PatientAppShell
      title={t("prescription")}
      backTo="/patient/records?tab=prescriptions"
      hideTabs
      headerAction={
        reminderMedicines.length > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11"
            aria-label={
              anyRemindersOn
                ? t("patient_prescription__manage_alarms")
                : t("patient_prescription__set_alarms")
            }
            aria-pressed={anyRemindersOn}
            onClick={() => setAlarmOpen(true)}
          >
            <AlarmBellIcon armed={anyRemindersOn} />
          </Button>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-3 p-4">
        {!prescription ? (
          <>
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </>
        ) : (
          <>
            <PrescriptionSummary prescription={prescription} />

            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {t("medications")} · {medications.length}
            </span>

            {medications.length ? (
              medications.map((medication) => (
                <MedicineCard
                  key={medication.id}
                  medication={medication}
                  armed={armedIds.includes(medication.id)}
                  doses={dosesByMedicine[medication.id] ?? []}
                  dosesLoading={dosesLoading}
                />
              ))
            ) : (
              <EmptyState
                icon={<Pill className="size-6 text-primary-700" />}
                title={t("no_medications_found")}
                className="gap-3 rounded-2xl border-gray-300 px-5 py-7 shadow-none"
              />
            )}

            {prescription.note && (
              <div className="flex flex-col gap-1.5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <span className="text-sm font-bold text-gray-900">
                  {t("patient_records__doctors_advice")}
                </span>
                <span className="text-xs leading-relaxed text-gray-600">
                  {prescription.note}
                </span>
              </div>
            )}
          </>
        )}
      </div>
      {alarmOpen && reminderMedicines.length > 0 && (
        <PrescriptionAlarmSheet
          open
          onOpenChange={setAlarmOpen}
          medicines={reminderMedicines}
          patientId={selectedPatient?.id}
        />
      )}
    </PatientAppShell>
  );
}
