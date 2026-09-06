import { HttpError } from "../utils/HttpError.js";

const MINUTES_PER_DAY = 24 * 60;

/**
 * Current wall-clock day and minute in the given IANA timezone, without
 * pulling in a date library. Intl gives us the timezone-shifted parts.
 */
export const nowInZone = (timezone, date = new Date()) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((p) => [p.type, p.value])
  );

  const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  // "24" appears at midnight under hour12:false in some ICU versions.
  const hour = Number(parts.hour) % 24;

  return {
    day: days[parts.weekday] ?? date.getDay(),
    minutes: hour * 60 + Number(parts.minute),
  };
};

/**
 * Whether the restaurant is currently taking orders.
 *
 * Handles hours that wrap past midnight (e.g. open 10:00, close 02:00) by
 * treating close <= open as spilling into the next day.
 */
export const getOpenState = (settings, date = new Date()) => {
  if (settings?.ordersPaused) {
    return {
      isOpen: false,
      reason:
        settings.pausedMessage?.trim() ||
        "We have paused new orders for a moment. Please try again shortly.",
    };
  }

  const timezone = settings?.hours?.timezone || "Asia/Amman";
  const week = settings?.hours?.week;

  // No schedule configured means always open, rather than accidentally
  // closing a restaurant that never set its hours.
  if (!Array.isArray(week) || week.length !== 7) {
    return { isOpen: true };
  }

  const { day, minutes } = nowInZone(timezone, date);
  const today = week[day];
  const yesterday = week[(day + 6) % 7];

  const withinToday =
    today &&
    !today.isClosed &&
    (today.close > today.open
      ? minutes >= today.open && minutes < today.close
      : minutes >= today.open); // wraps past midnight

  // A shift that started yesterday and runs past midnight still covers now.
  const withinOvernight =
    yesterday &&
    !yesterday.isClosed &&
    yesterday.close <= yesterday.open &&
    minutes < yesterday.close;

  if (withinToday || withinOvernight) return { isOpen: true };

  return {
    isOpen: false,
    reason: "We are closed right now.",
    nextOpen: findNextOpen(week, day, minutes),
  };
};

/** Human-readable next opening slot, e.g. "Monday 10:00". */
const findNextOpen = (week, day, minutes) => {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  for (let offset = 0; offset < 8; offset += 1) {
    const index = (day + offset) % 7;
    const slot = week[index];
    if (!slot || slot.isClosed) continue;
    if (offset === 0 && minutes >= slot.open) continue;
    const hh = String(Math.floor(slot.open / 60)).padStart(2, "0");
    const mm = String(slot.open % 60).padStart(2, "0");
    return `${names[index]} ${hh}:${mm}`;
  }
  return undefined;
};

/** Throw a 503 when the restaurant is not accepting orders. */
export const assertOpen = (settings, date = new Date()) => {
  const state = getOpenState(settings, date);
  if (!state.isOpen) {
    throw new HttpError(503, state.reason, {
      ...(state.nextOpen ? { nextOpen: state.nextOpen } : {}),
    });
  }
};

export { MINUTES_PER_DAY };
