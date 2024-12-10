import { MedicationRequest } from "@/types/emr/medicationRequest";
import { AllergyIntolerance } from "@/types/questionnaire/allergyIntolerance";
import { Code } from "@/types/questionnaire/code";
import { Condition } from "@/types/questionnaire/condition";
import { StructuredQuestionType } from "@/types/questionnaire/question";

export type ResponseValue = {
  type:
    | "string"
    | "number"
    | "boolean"
    | "allergy_intolerance"
    | "medication_request"
    | "condition";
  value?:
    | string
    | number
    | boolean
    | AllergyIntolerance[]
    | MedicationRequest[]
    | Condition[];
  code?: Code;
};

export interface QuestionnaireResponse {
  question_id: string;
  structured_type: StructuredQuestionType | null;
  link_id: string;
  values: ResponseValue[];
  note?: string;
  taken_at?: string;
  body_site?: Code;
  method?: Code;
}
