import { Code, QuestionStatus, SubjectType } from "./base";
import { Question } from "./question";

export type QuestionnaireType =
  | "custom"
  | "allergy_intolerance"
  | "medication_request"
  | "medication_statement"
  | "immunization";

export interface QuestionnaireDetail {
  id: string;
  slug: string;
  version?: string;
  code?: Code;
  questions: Question[];
  type: QuestionnaireType;
  title: string;
  description?: string;
  status: QuestionStatus;
  subject_type: SubjectType;
}

export interface QuestionnaireResponse {
  count: number;
  results: QuestionnaireDetail[];
}
