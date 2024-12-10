import { ConsultationModel } from "../Facility/models";
import { PatientModel } from "../Patient/models";
import { UserBareMinimum } from "../Users/models";

export type Coding = {
  system: string;
  code: string;
  display?: string;
};

export type Timing = unknown; // TODO: needs to be implemented

export type Annotation = {
  authorString?: string;
  authorReference?: UserBareMinimum;
  time?: string;
  text: string;
};

export type ServiceRequest = {
  id: string;

  status?:
    | "draft"
    | "active"
    | "on-hold"
    | "revoked"
    | "completed"
    | "entered-in-error"
    | "unknown";
  intent?: "proposal" | "plan" | "directive" | "order";
  priority?: "routine" | "urgent" | "asap" | "stat";

  category?: Coding;
  code: Coding;

  do_not_perform?: boolean;

  subject: PatientModel;
  encounter: ConsultationModel;

  occurrence_datetime?: string | null;
  occurrence_timing?: Timing | null;
  as_needed?: boolean;
  as_needed_for?: Coding | null;

  authored_on: string;
  requester: UserBareMinimum;

  location: string | null;

  note: Annotation[];

  patient_instruction?: string;

  replaces?: ServiceRequest | null;
};
