import { Code } from "./code";

export type QuestionType =
  | "group"
  | "display"
  | "boolean"
  | "decimal"
  | "integer"
  | "date"
  | "dateTime"
  | "time"
  | "string"
  | "text"
  | "url"
  | "choice"
  | "structured";

export type StructuredQuestionType =
  | "allergy_intolerance"
  | "medication_request";

export interface EnableWhen {
  question: string;
  operator:
    | "exists"
    | "equals"
    | "not_equals"
    | "greater"
    | "less"
    | "greater_or_equals"
    | "less_or_equals";
  answer: string | number | boolean;
}

export interface AnswerOption {
  value: string;
  initialSelected?: boolean;
}

export interface Question {
  id: string;
  link_id: string;
  code?: Code;
  text: string;
  description?: string;
  type: QuestionType;
  structured_type?: StructuredQuestionType;
  required?: boolean;
  collect_time?: boolean;
  collect_performer?: boolean;
  collect_body_site?: boolean;
  collect_method?: boolean;
  enable_when?: EnableWhen[];
  enable_behavior?: "all" | "any";
  disabled_display?: "hidden" | "protected";
  repeats?: boolean;
  read_only?: boolean;
  max_length?: number;
  answer_constraint?: string;
  answer_option?: AnswerOption[];
  answer_value_set?: string;
  answer_unit?: Code;
  is_observation?: boolean;
  questions?: Question[];
  formula?: string;
}
