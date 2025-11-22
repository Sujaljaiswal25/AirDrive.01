import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "";

  const dateObj = new Date(date);

  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, "HH:mm")}`;
  }

  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, "HH:mm")}`;
  }

  return format(dateObj, "MMM dd, yyyy HH:mm");
};

export const formatRelativeTime = (date) => {
  if (!date) return "";

  return formatDistanceToNow(new Date(date), { addSuffix: true });
};
