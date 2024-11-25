import { isSameDay, isWithinInterval } from "date-fns";

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

export function calculateTokenDuration(
  startTime: string,
  endTime: string,
  tokensAllowed: number,
): number | null {
  if (!startTime || !endTime || !tokensAllowed) return null;

  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);

  const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

  if (diffInMinutes <= 0 || tokensAllowed <= 0) return null;

  return Math.round(diffInMinutes / tokensAllowed);
}
