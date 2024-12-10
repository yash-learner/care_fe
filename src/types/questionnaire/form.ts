import type { AllergyIntolerance } from "./allergyIntolerance";
import type { Code } from "./code";
import { StructuredQuestionType } from "./question";

export type ResponseValue = {
  type: "string" | "number" | "boolean" | "allergy_intolerance";
  value?: string | number | boolean | AllergyIntolerance[];
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
