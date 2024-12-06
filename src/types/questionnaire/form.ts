import type { Code } from "./code";

export type QuestionValue = string | number | boolean | Code | never[];

export interface QuestionnaireResponse {
  question_id: string;
  link_id: string;
  values: QuestionValue[];
  note?: string;
  taken_at?: string;
  body_site?: Code;
  method?: Code;
}
