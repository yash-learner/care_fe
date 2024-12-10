import { Code } from "./code";

export const CONDITION_CLINICAL_STATUS = [
  "active",
  "recurrence",
  "relapse",
  "inactive",
  "remission",
  "resolved",
] as const;

export type ConditionClinicalStatus =
  (typeof CONDITION_CLINICAL_STATUS)[number];

export const CONDITION_VERIFICATION_STATUS = [
  "unconfirmed",
  "provisional",
  "differential",
  "confirmed",
  "refuted",
  "entered-in-error",
] as const;

export type ConditionVerificationStatus =
  (typeof CONDITION_VERIFICATION_STATUS)[number];

export interface Condition {
  code: Code;
  clinicalStatus: ConditionClinicalStatus;
  verificationStatus: ConditionVerificationStatus;
  onsetDateTime?: string;
  recordedDate?: string;
  note?: string;
}

export interface ConditionRequest {
  clinical_status: ConditionClinicalStatus;
  verification_status: ConditionVerificationStatus;
  code: Code;
  onset_date_time?: string;
  recorded_date?: string;
  note?: string;
  encounter: string;
}
