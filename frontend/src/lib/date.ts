type FormatOptions = {
  includeTime?: boolean;
  includeYear?: boolean;
  includeWeekday?: boolean;
  month?: "short" | "long";
  fallback?: string;
};

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(options: FormatOptions) {
  const key = [
    options.includeTime ? "t" : "d",
    options.includeYear ? "y" : "n",
    options.includeWeekday ? "w" : "nw",
    options.month ?? "short",
  ].join("-");

  const cached = formatterCache.get(key);
  if (cached) return cached;

  const formatOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: options.month ?? "short",
  };

  if (options.includeYear) formatOptions.year = "numeric";
  if (options.includeWeekday) formatOptions.weekday = "long";
  if (options.includeTime) {
    formatOptions.hour = "2-digit";
    formatOptions.minute = "2-digit";
    formatOptions.hour12 = false;
  }

  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", formatOptions);
  formatterCache.set(key, formatter);
  return formatter;
}

/**
 * Formats a date using the Persian (Jalali) calendar with Persian digits.
 */
export function formatPersianDate(value: string | number | Date, options: FormatOptions = {}) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return options.fallback ?? "—";
  }

  return getFormatter(options).format(date);
}
