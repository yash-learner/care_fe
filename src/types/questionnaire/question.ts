import { AnswerOption, AnswerUnit, Code, QuestionType } from "./base";

export interface EnableWhen {
  question: string;
  operator: "exists" | "eq" | "ne" | "gt" | "lt" | "ge" | "le";
  answer: string | number | boolean;
}

export interface Question {
  id: string;
  link_id: string;
  code?: Code;
  text: string;
  type: QuestionType;
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
  answer_unit?: AnswerUnit;
  is_observation?: boolean;
  questions?: Question[];
  formula?: string;
}
