import { UserBareMinimum } from "@/components/Users/models";

import { Annotation } from "@/types/emr/base";
import { Encounter } from "@/types/emr/encounter";
import { Patient } from "@/types/emr/newPatient";
import { Observation } from "@/types/emr/observation";
import { ServiceRequest } from "@/types/emr/serviceRequest";
import { Specimen } from "@/types/emr/specimen";
import { Code } from "@/types/questionnaire/code";

export const DIAGNOSTIC_REPORT_STATUS = [
  "registered",
  "partial",
  "preliminary",
  "final",
  "amended",
  "corrected",
  "appended",
  "cancelled",
  "entered-in-error",
  "unknown",
] as const;

export type DiagnosticReportStatus = (typeof DIAGNOSTIC_REPORT_STATUS)[number];

export type DiagnosticReport = {
  id: string;
  status: DiagnosticReportStatus;

  category?: Code | null;
  code?: Code;

  based_on: ServiceRequest;
  subject: Patient;
  encounter: Encounter;

  performer?: UserBareMinimum | null;
  results_interpreter?: UserBareMinimum | null;

  issued?: string | null;
  effective_period?: string | null;

  specimen: Specimen[];
  result: Observation[];

  media: {
    comment?: string | null;
    link: string;
  }[];

  note: Annotation[];
  conclusion?: string | null;
};
