export const LABS_BASE_ROUTE = "/lab_orders";

export const COMMON_LAB_UNITS: readonly {
  code: string;
  display: string;
  system: string;
}[] = [
  {
    code: "mg/dL",
    display: "milligrams per deciliter",
    system: "http://unitsofmeasure.org",
  },
  {
    code: "mmol/L",
    display: "millimoles per liter",
    system: "http://unitsofmeasure.org",
  },
  {
    code: "g/dL",
    display: "grams per deciliter",
    system: "http://unitsofmeasure.org",
  },
  {
    code: "x10^3/μL",
    display: "thousands per microliter",
    system: "http://unitsofmeasure.org",
  },
  {
    code: "x10^6/μL",
    display: "millions per microliter",
    system: "http://unitsofmeasure.org",
  },
  {
    code: "U/L",
    display: "units per liter",
    system: "http://unitsofmeasure.org",
  },
  {
    code: "ng/mL",
    display: "nanograms per milliliter",
    system: "http://unitsofmeasure.org",
  },
  {
    code: "pg/mL",
    display: "picograms per milliliter",
    system: "http://unitsofmeasure.org",
  },
  {
    code: "%",
    display: "percentage",
    system: "http://unitsofmeasure.org",
  },
] as const;
