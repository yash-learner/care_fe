import type { Code } from "./code";

export type ResponseValue = {
  value?: string | number | boolean;
  code?: Code;
};

export interface QuestionnaireResponse {
  question_id: string;
  link_id: string;
  values: ResponseValue[];
  note?: string;
  taken_at?: string;
  body_site?: Code;
  method?: Code;
}
