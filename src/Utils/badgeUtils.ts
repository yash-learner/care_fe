import { BadgeProps } from "@/components/ui/badge";

/**
 * Dynamically maps keys to Badge variants using a provided mapping object.
 *
 * @param key - The key to map (e.g., "routine", "asap").
 * @param mapping - The mapping object that links keys to Badge variants.
 * @param defaultVariant - A fallback variant to use if the key is not found.
 */
export const mapKeyToBadgeVariant = (
  key: string | undefined,
  mapping: Record<string, BadgeProps["variant"]>,
  defaultVariant: BadgeProps["variant"] = "default",
): BadgeProps["variant"] => {
  return mapping[key?.toLowerCase() || ""] || defaultVariant;
};
