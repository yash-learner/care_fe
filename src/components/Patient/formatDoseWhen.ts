import dayjs from "dayjs";

export function formatDoseWhen(scheduledAt: string): string {
  const at = dayjs(scheduledAt);
  if (at.isSame(dayjs(), "day")) {
    return at.format("h:mm A");
  }
  return at.format("ddd D MMM, h:mm A");
}
