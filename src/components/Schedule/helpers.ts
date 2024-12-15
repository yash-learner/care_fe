import { isSameDay, isWithinInterval } from "date-fns";

import { DayOfWeekValue } from "@/CAREUI/interactive/WeekdayCheckbox";

import { ScheduleAvailability } from "@/components/Schedule/types";

import { Time } from "@/Utils/types";

export const isDateInRange = (
  date: Date,
  startDate: string,
  endDate: string,
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return (
    isWithinInterval(date, { start, end }) ||
    isSameDay(date, start) ||
    isSameDay(date, end)
  );
};

export function getDurationInMinutes(startTime: Time, endTime: Time) {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);

  if (
    start.toString() === "Invalid Date" ||
    end.toString() === "Invalid Date"
  ) {
    return null;
  }

  return (end.getTime() - start.getTime()) / (1000 * 60);
}

export function getSlotsPerSession(
  startTime: Time,
  endTime: Time,
  slotSizeInMinutes: number,
) {
  const duration = getDurationInMinutes(startTime, endTime);
  if (!duration) return null;
  return duration / slotSizeInMinutes;
}

export function getTokenDuration(
  slotSizeInMinutes: number,
  tokensPerSlot: number,
) {
  return slotSizeInMinutes / tokensPerSlot;
}

export const filterAvailabilitiesByDayOfWeek = (
  availabilities: ScheduleAvailability[],
  date?: Date,
) => {
  // Doing this weird things because backend uses python's 0-6.
  // TODO: change to strings at seriazlier level...? or bitwise operations?
  const dayOfWeek = ((date ?? new Date()).getDay() + 6) % 7;
  return availabilities.filter(({ days_of_week }) =>
    days_of_week.includes(dayOfWeek as DayOfWeekValue),
  );
};
