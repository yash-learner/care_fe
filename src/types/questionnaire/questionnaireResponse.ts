import { QuestionnaireResponse as Response } from "./form";
import { QuestionnaireDetail } from "./questionnaire";

export type StructuredResponseValue = {
  id: "symptom" | "medication" | "diagnosis" | "procedure" | "note";
  submit_type: "CREATE" | "UPDATE";
};

export interface QuestionnaireResponse {
  id: string;
  created_date: string;
  modified_date: string;
  questionnaire?: QuestionnaireDetail;
  subject_id: string;
  responses: Response[];
  encounter: string;
  patient: string;
  structured_responses?: Record<string, StructuredResponseValue>;
  created_by: {
    first_name: string;
    last_name: string;
    title?: string;
  };
}
