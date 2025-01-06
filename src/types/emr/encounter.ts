import { Patient } from "@/types/emr/newPatient";
import { UserBase } from "@/types/user/user";

import { FacilityOrganization } from "../facilityOrganization/facilityOrganization";

export type EncounterStatus =
  | "planned"
  | "in_progress"
  | "on_hold"
  | "discharged"
  | "completed"
  | "cancelled"
  | "discontinued"
  | "entered_in_error"
  | "unknown";

export type EncounterClass = "imp" | "amb" | "obsenc" | "emer" | "vr" | "hh";

export type EncounterAdmitSources =
  | "hosp_trans"
  | "emd"
  | "outp"
  | "born"
  | "gp"
  | "mp"
  | "nursing"
  | "psych"
  | "rehab"
  | "other";

export type EncounterDischargeDisposition =
  | "home"
  | "alt_home"
  | "other_hcf"
  | "hosp"
  | "long"
  | "aadvice"
  | "exp"
  | "psy"
  | "rehab"
  | "snf"
  | "oth";

export type EncounterDietPreference =
  | "vegetarian"
  | "diary_free"
  | "nut_free"
  | "gluten_free"
  | "vegan"
  | "halal"
  | "kosher"
  | "none";

export type EncounterPriority =
  | "ASAP"
  | "callback_results"
  | "callback_for_scheduling"
  | "elective"
  | "emergency"
  | "preop"
  | "as_needed"
  | "routine"
  | "rush_reporting"
  | "stat"
  | "timing_critical"
  | "use_as_directed"
  | "urgent";

export type Period = {
  start?: string;
  end?: string;
};

export type Hospitalization = {
  re_admission: boolean;
  admit_source: EncounterAdmitSources;
  discharge_disposition?: EncounterDischargeDisposition;
  diet_preference?: EncounterDietPreference;
};

export type History = {
  status: string;
  moved_at: string;
};

export type EncounterClassHistory = {
  history: History[];
};

export type StatusHistory = {
  history: History[];
};

export interface Encounter {
  id: string;
  patient: Patient;
  facility: {
    id: string;
    name: string;
  };
  status: EncounterStatus;
  encounter_class: EncounterClass;
  period: Period;
  hospitalization?: Hospitalization;
  priority: EncounterPriority;
  external_identifier?: string;
  created_by: UserBase;
  updated_by: UserBase;
  created_date: string;
  modified_date: string;
  encounter_class_history: EncounterClassHistory;
  status_history: StatusHistory;
  organizations: FacilityOrganization[];
}

export interface EncounterEditRequest {
  organizations: string[];
  patient: string;
  status: EncounterStatus;
  encounter_class: EncounterClass;
  period: Period;
  hospitalization?: Hospitalization;
  priority: EncounterPriority;
  external_identifier?: string;
  facility: string;
}

export interface EncounterRequest {
  organizations: string[];
  patient: string;
  status: EncounterStatus;
  encounter_class: EncounterClass;
  period: Period;
  hospitalization?: Hospitalization;
  priority: EncounterPriority;
  external_identifier?: string;
  facility: string;
}

export const completedEncounterStatus = ["completed", "discharged"];
