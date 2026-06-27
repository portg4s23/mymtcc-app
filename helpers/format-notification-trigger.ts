type DateComponents = {
  weekday: number; // 1 = Sunday ... 7 = Saturday
  hour: number;
  minute: number;
};

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const formatNotificationTrigger = (
  dateComponents: DateComponents,
): string => {
  const { weekday, hour, minute } = dateComponents;

  const day = WEEKDAYS[weekday - 1] ?? "Unknown";

  return `${day}, ${hour}:${String(minute).padStart(2, "0")}`;
};