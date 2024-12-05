// Basic building blocks
export interface Code {
  system: string;
  code: string;
  display?: string;
}

export interface AnswerOption {
  value: string | number | boolean;
  initialSelected?: boolean;
}

export interface AnswerUnit {
  code: string;
  display?: string;
  system?: string;
}

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

export type QuestionStatus = "active" | "retired" | "draft";
export type SubjectType = "patient";
