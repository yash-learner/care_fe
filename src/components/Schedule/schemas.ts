import { DayOfWeekValue } from "@/CAREUI/interactive/WeekdayCheckbox";

import { Time, WritableOnly } from "@/Utils/types";

interface ScheduleResource {
  id: string;
  facility: {
    id: string;
    name: string;
  };
}

export interface ScheduleTemplate {
  readonly id: string;
  readonly resource: ScheduleResource;
  name: string;
  valid_from: string;
  valid_to: string;
  availability: ScheduleAvailability[];
}

export interface ScheduleTemplateCreate extends WritableOnly<ScheduleTemplate> {
  doctor_username: string;
}

export const ScheduleSlotTypes = [
  "EMERGENCY",
  "OP_SCHEDULE",
  "IP_SCHEDULE",
  "OPERATION_THEATRE",
  "FOLLOW_UP_VISIT",
  "SPECIALIST_REFERRAL",
] as const;

export interface ScheduleAvailability {
  readonly id: string;
  name: string;
  slot_type: (typeof ScheduleSlotTypes)[number];
  slot_size_in_minutes: number;
  tokens_per_slot: number;
  days_of_week: DayOfWeekValue[];
  start_time: Time;
  end_time: Time;
}
