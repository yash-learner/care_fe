import { Code, QuestionStatus, SubjectType } from "./base";
import { Question } from "./question";

export interface QuestionnaireDetail {
  id: string;
  version?: string;
  code?: Code;
  questions: Question[];
  title: string;
  description?: string;
  status: QuestionStatus;
  subject_type: SubjectType;
}

export interface QuestionnaireResponse {
  count: number;
  results: QuestionnaireDetail[];
}
