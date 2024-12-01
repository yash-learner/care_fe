import type { QuestionnaireDetail } from "./questionnaire";

export interface QuestionValue {
  id: string;
  value: string | number | boolean;
  note?: string;
  bodysite?: string;
  method?: string;
}

export interface QuestionnaireFormProps {
  questionnaire: QuestionnaireDetail;
  onSubmit: (values: QuestionValue[]) => void;
  isSubmitting?: boolean;
}
