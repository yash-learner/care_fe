import { UserBareMinimum } from "@/components/Users/models";

import { Code } from "../questionnaire/code";

export interface Timing {
  repeat?: {
    frequency?: number;
    frequency_max?: number;
    period?: number;
    period_max?: number;
    period_unit?: "s" | "min" | "h" | "d" | "wk" | "mo" | "a";
  };
  code?: Code;
}

export type Annotation = {
  authorString?: string;
  authorReference?: UserBareMinimum;
  time?: string;
  text: string;
};
