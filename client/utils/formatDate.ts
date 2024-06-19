import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function formatDate(date: string) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const parsedDate = parseISO(date);
    const zonedDate = toZonedTime(parsedDate, timeZone);

    const formattedDate = format(zonedDate, "EEE, MMM d, hh:mm a");
    return formattedDate;
}