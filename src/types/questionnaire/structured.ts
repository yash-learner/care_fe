import { AllergyIntolerance } from "./allergyIntolerance";
import { StructuredQuestionType } from "./question";

// Define request body types for each structured type
export interface AllergyIntoleranceRequest {
  clinical_status: string;
  verification_status: string;
  category: string;
  criticality: string;
  code: { code: string; display: string; system: string };
  last_occurrence?: string;
  note?: string;
  encounter: string;
}

// Add other structured request types here
export interface MedicationRequest {
  // ... medication request fields
}

// Map structured types to their data types
export interface StructuredDataMap {
  allergy_intolerance: AllergyIntolerance;
  medication_request: MedicationRequest;
  // Add other structured types here
}

// Map structured types to their request types
export interface StructuredRequestMap {
  allergy_intolerance: AllergyIntoleranceRequest;
  medication_request: MedicationRequest;
  // Add other structured types here
}

// Helper type to get the request type for a structured type
export type RequestTypeFor<T extends StructuredQuestionType> =
  StructuredRequestMap[T];

// Helper type to get the data type for a structured type
export type DataTypeFor<T extends StructuredQuestionType> =
  StructuredDataMap[T];
