import { Code } from "@/types/questionnaire/code";

type MedicationRequestStatus =
  | "active"
  | "on-hold"
  | "ended"
  | "stopped"
  | "completed"
  | "cancelled"
  | "entered-in-error"
  | "draft"
  | "unknown";

type MedicationRequestStatusReason =
  | "altchoice"
  | "clarif"
  | "drughigh"
  | "hospadm"
  | "labint"
  | "non_avail"
  | "preg"
  | "salg"
  | "sddi"
  | "sdupther"
  | "sintol"
  | "surg"
  | "washout";

type MedicationRequestIntent =
  | "proposal"
  | "plan"
  | "order"
  | "original_order"
  | "reflex_order"
  | "filler_order"
  | "instance_order";

type MedicationRequestPrioritie = "routine" | "urgent" | "asap" | "stat";

type MedicationRequestCategorie =
  | "inpatient"
  | "outpatient"
  | "community"
  | "discharge";

type TimingUnit = "s" | "min" | "h" | "d" | "wk" | "mo" | "a";

type DoseType = "ordered" | "calculated";

interface DosageQuantity {
  value: number;
  unit: string;
}

interface DoseRange {
  low: DosageQuantity;
  high: DosageQuantity;
}

interface DoseAndRate {
  type?: DoseType | null;
  dose_range?: DoseRange | null;
  dose_quantity?: DosageQuantity | null;
}

interface TimingRepeat {
  frequency?: number | null;
  period: number;
  period_unit: TimingUnit;
  bounds_duration?: DosageQuantity | null;
}

interface Timing {
  repeat?: TimingRepeat | null;
  code?: Code | null;
}

interface DosageInstruction {
  sequence?: number | null;
  text?: string | null;
  additional_instruction?: Code[] | null;
  patient_instruction?: string | null;
  timing?: Timing | null;
  as_needed_boolean?: boolean | null;
  as_needed_for?: Code | null;
  site?: Code | null;
  route?: Code | null;
  method?: Code | null;
  dose_and_rate?: DoseAndRate[] | null;
  max_dose_per_period?: DoseRange | null;
}

export interface MedicationRequest {
  readonly id: string;
  status?: MedicationRequestStatus;
  status_reason?: MedicationRequestStatusReason;
  status_changed?: string | null; // DateTime
  intent?: MedicationRequestIntent;
  category?: MedicationRequestCategorie;
  priority?: MedicationRequestPrioritie;
  do_not_perform: boolean;
  medication: Code;
  patient?: string | null; // UUID
  encounter?: string | null; // UUID
  authored_on: string;
  dosage_instruction: DosageInstruction[];
  note?: string | null;
}
