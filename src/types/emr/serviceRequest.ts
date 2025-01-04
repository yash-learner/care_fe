import { UserBareMinimum } from "@/components/Users/models";

import { Annotation, Timing } from "@/types/emr/base";
import { Encounter } from "@/types/emr/encounter";
import { Patient } from "@/types/emr/newPatient";
import { Code } from "@/types/questionnaire/code";

export const SERVICE_REQUEST_STATUS = [
  "draft",
  "active",
  "on-hold",
  "revoked",
  "completed",
  "entered-in-error",
  "unknown",
] as const;

export type ServiceRequestStatus = (typeof SERVICE_REQUEST_STATUS)[number];

export const SERVICE_REQUEST_INTENT = [
  "proposal",
  "plan",
  "directive",
  "order",
] as const;

export type ServiceRequestIntent = (typeof SERVICE_REQUEST_INTENT)[number];

export const SERVICE_REQUEST_PRIORITY = [
  "routine",
  "urgent",
  "asap",
  "stat",
] as const;

export type ServiceRequestPriority = (typeof SERVICE_REQUEST_PRIORITY)[number];

export type ServiceRequest = {
  id: string;

  status?: ServiceRequestStatus;
  intent?: ServiceRequestIntent;
  priority?: ServiceRequestPriority;

  category?: Code;
  code: Code;

  do_not_perform?: boolean;

  subject: Patient;
  encounter: Encounter;

  occurrence_datetime?: string | null;
  occurrence_timing?: Timing | null;
  as_needed?: boolean;
  as_needed_for?: Code | null;

  authored_on: string;
  requester: UserBareMinimum;

  location: string | null;

  note: Annotation[];

  patient_instruction?: string;

  replaces?: ServiceRequest | null;
};
