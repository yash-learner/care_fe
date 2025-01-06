import { UserBareMinimum } from "@/components/Users/models";

import { Organization } from "../organization/organization";

export type BloodGroupChoices =
  | "A_negative"
  | "A_positive"
  | "B_negative"
  | "B_positive"
  | "AB_negative"
  | "AB_positive"
  | "O_negative"
  | "O_positive"
  | "unknown";

export type GenderChoices = "male" | "female" | "non_binary" | "transgender";

export interface Patient {
  id: string;
  name: string;
  gender: GenderChoices;
  phone_number: string;
  emergency_phone_number?: string;
  address: string;
  permanent_address: string;
  pincode: string;
  date_of_birth: string;
  age?: string;
  death_datetime?: string;
  blood_group?: BloodGroupChoices;
  year_of_birth: number;
  created_date: string;
  modified_date: string;
  geo_organization: Organization;
  created_by: UserBareMinimum;
  updated_by: UserBareMinimum;
}

export interface PartialPatientModel {
  id: string;
  gender: GenderChoices;
  name: string;
  phone_number: string;
  partial_id: string;
}
