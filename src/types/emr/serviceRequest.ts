import { UserBareMinimum } from "@/components/Users/models";

import { Timing } from "@/types/emr/base";
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

export const SERVICE_REQUEST_PHASE = [
  "order_placed",
  "order_in_progress",
  "sample_collected",
  "sample_sent_to_lab",
  "sample_received_at_lab",
  "sample_rejected",
  "sample_in_process",
  "result_under_verification",
  "result_under_review",
  "result_invalid",
  "order_completed",
  "order_cancelled",
  "not_available",
] as const;

export type ServiceRequestPhase = (typeof SERVICE_REQUEST_PHASE)[number];

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

export const SERVICE_REQUEST_CATEGORY = [
  "laboratory_procedure",
  "imaging",
  "counselling",
  "education",
  "surgical_procedure",
] as const;

export type ServiceRequestCategory = (typeof SERVICE_REQUEST_CATEGORY)[number];

export type ServiceRequest = {
  id: string;

  status?: ServiceRequestStatus;
  phase?: ServiceRequestPhase;
  intent?: ServiceRequestIntent;
  priority?: ServiceRequestPriority;

  category?: ServiceRequestCategory;
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

  location?: string | null;

  note?: string | null;

  patient_instruction?: string;

  replaces?: ServiceRequest | null;
};

export type ServiceRequestCreate = Omit<
  ServiceRequest,
  | "id"
  | "requester"
  | "location"
  | "replaces"
  | "do_not_perform"
  | "encounter"
  | "subject"
> & {
  encounter: string; // uuid
  subject: string; // uuid
};

export const SERVICE_REQUEST_PHASE_DISPLAY: Record<
  ServiceRequestPhase,
  string
> = {
  order_placed: "Order Placed",
  order_in_progress: "Order In Progress",
  sample_collected: "Sample Collected",
  sample_sent_to_lab: "Sample Sent to Lab",
  sample_received_at_lab: "Sample Received at Lab",
  sample_rejected: "Sample Rejected",
  sample_in_process: "Sample In Process",
  result_under_verification: "Result Under Verification",
  result_under_review: "Result Under Review",
  result_invalid: "Result Invalid",
  order_completed: "Order Completed",
  order_cancelled: "Order Cancelled",
  not_available: "Not Available",
};

export const SERVICE_REQUEST_PHASE_COLORS: Record<ServiceRequestPhase, string> =
  {
    order_placed: "bg-blue-100 text-blue-800",
    order_in_progress: "bg-yellow-100 text-yellow-800",
    sample_collected: "bg-green-100 text-green-800",
    sample_sent_to_lab: "bg-purple-100 text-purple-800",
    sample_received_at_lab: "bg-indigo-100 text-indigo-800",
    sample_rejected: "bg-red-100 text-red-800",
    sample_in_process: "bg-orange-100 text-orange-800",
    result_under_verification: "bg-teal-100 text-teal-800",
    result_under_review: "bg-gray-100 text-gray-800",
    result_invalid: "bg-pink-100 text-pink-800",
    order_completed: "bg-green-100 text-green-800",
    order_cancelled: "bg-red-100 text-red-800",
    not_available: "bg-gray-100 text-gray-800",
  };
