import { UserBareMinimum } from "@/components/Users/models";

import { CodeableConcept } from "@/types/emr/base";
import { Patient } from "@/types/emr/newPatient";
import { ServiceRequest } from "@/types/emr/serviceRequest";
import { Code } from "@/types/questionnaire/code";

export const SPECIMEN_STATUS = [
  "available",
  "unavailable",
  "unsatisfactory",
  "entered-in-error",
] as const;

export type SpecimenStatus = (typeof SPECIMEN_STATUS)[number];

export type Specimen = {
  id: string;
  identifier?: string | null;
  accession_identifier?: string | null;

  status?: SpecimenStatus | null;

  type: Code;

  subject: Patient;
  request: ServiceRequest;

  collected_by?: UserBareMinimum | null;
  collected_at?: string | null;

  dispatched_by?: UserBareMinimum | null;
  dispatched_at?: string | null;

  received_by?: UserBareMinimum | null;
  received_at?: string | null;

  report?: [
    {
      id: string;
    },
  ];

  condition?: CodeableConcept[] | null;

  processing: {
    description?: string | null;
    method?: Code | null;
    time: string;
    performer?: string | null;
  }[];

  note?: string | null;

  parent?: Specimen | null;
};
