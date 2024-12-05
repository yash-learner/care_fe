import type { Code } from "./base";
import type { QuestionnaireDetail } from "./questionnaire";

export type QuestionValue = string | number | boolean | Code;

export interface QuestionnaireSubmitResult {
  question_id: string;
  values: QuestionValue[];
  link_id: string;
  note?: string;
  taken_at?: string;
  body_site?: Code;
  method?: Code;
}

export interface QuestionnaireFormProps {
  questionnaire: QuestionnaireDetail;
  onSubmit: (values: QuestionnaireSubmitResult[]) => void;
  isSubmitting?: boolean;
}
