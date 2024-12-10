import { MedicationRequest } from "@/types/emr/medicationRequest";
import {
  AllergyIntolerance,
  AllergyIntoleranceRequest,
} from "@/types/questionnaire/allergyIntolerance";
import { StructuredQuestionType } from "@/types/questionnaire/question";

// Map structured types to their data types
export interface StructuredDataMap {
  allergy_intolerance: AllergyIntolerance;
  medication_request: MedicationRequest;
}

// Map structured types to their request types
export interface StructuredRequestMap {
  allergy_intolerance: AllergyIntoleranceRequest;
  medication_request: MedicationRequest;
}

export type RequestTypeFor<T extends StructuredQuestionType> =
  StructuredRequestMap[T];

export type DataTypeFor<T extends StructuredQuestionType> =
  StructuredDataMap[T];
