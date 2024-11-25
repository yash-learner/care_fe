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
