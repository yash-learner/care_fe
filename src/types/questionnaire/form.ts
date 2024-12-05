import type { QuestionnaireDetail } from "./questionnaire";

export interface QuestionValue {
  id: string;
  value: string | number | boolean;
  linkId: string;
  note?: string;
  bodysite?: string;
  method?: string;
}

export interface QuestionnaireFormProps {
  questionnaire: QuestionnaireDetail;
  onSubmit: (values: QuestionValue[]) => void;
  isSubmitting?: boolean;
}
