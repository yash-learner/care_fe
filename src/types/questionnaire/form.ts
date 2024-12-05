import type { Code } from "./code";

export type QuestionValueX = string | number | boolean | Code;

export interface QuestionnaireResponse {
  question_id: string;
  values: QuestionValueX[];
  link_id: string;
  note?: string;
  taken_at?: string;
  body_site?: Code;
  method?: Code;
}
