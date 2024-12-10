import { Code } from "../questionnaire/code";

// Base type for allergy data
export interface AllergyIntolerance {
  code: Code;
  clinicalStatus?: string;
  verificationStatus?: string;
  category?: string;
  criticality?: string;
  lastOccurrence?: string;
  note?: string;
}

// Type for API request, extends base type with required fields
export interface AllergyIntoleranceRequest {
  clinical_status: string;
  verification_status: string;
  category: string;
  criticality: string;
  code: Code;
  last_occurrence?: string;
  note?: string;
  encounter: string;
}
