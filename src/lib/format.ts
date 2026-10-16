type RelativeUnit = "year" | "month" | "week" | "day" | "hour" | "minute";

const UNITS: [RelativeUnit, number][] = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["week", 7 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
];

let relativeFormatter: Intl.RelativeTimeFormat | null | undefined;

function getRelativeFormatter(): Intl.RelativeTimeFormat | null {
  if (relativeFormatter !== undefined) {
    return relativeFormatter;
  }
  const RelativeTimeFormat = Intl.RelativeTimeFormat;
  if (typeof RelativeTimeFormat !== "function") {
    relativeFormatter = null;
    return null;
  }
  try {
    relativeFormatter = new RelativeTimeFormat(undefined, { numeric: "auto" });
  } catch {
    relativeFormatter = null;
  }
  return relativeFormatter;
}

function formatRelativeFallback(signedAmount: number, unit: RelativeUnit): string {
  const amount = Math.abs(signedAmount);
  const suffix = amount === 1 ? unit : `${unit}s`;
  if (signedAmount < 0) {
    return `${amount} ${suffix} ago`;
  }
  return `in ${amount} ${suffix}`;
}

export function formatRelative(iso: string): string {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  if (Number.isNaN(seconds)) {
    return "";
  }

  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) {
      const formatter = getRelativeFormatter();
      if (formatter) {
        return formatter.format(Math.round(seconds / size), unit);
      }
      return formatRelativeFallback(Math.round(seconds / size), unit);
    }
  }
  return "just now";
}

export function fullName(
  person?: { firstName?: string; lastName?: string } | null,
): string {
  return [person?.firstName, person?.lastName].filter(Boolean).join(" ");
}
