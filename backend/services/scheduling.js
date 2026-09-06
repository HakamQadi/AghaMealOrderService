import { badRequest } from "../utils/HttpError.js";
import { getOpenState } from "./businessHours.js";

const SLOT_MINUTES = 30;

/** Round a time down to the slot it belongs to. */
export const slotFor = (date) => {
  const slot = new Date(date);
  slot.setSeconds(0, 0);
  slot.setMinutes(Math.floor(slot.getMinutes() / SLOT_MINUTES) * SLOT_MINUTES);
  return slot;
};

/**
 * Validate a requested pre-order time.
 *
 * @param {Date|string|undefined} requested
 * @returns {Date|undefined} the normalised slot, or undefined for ASAP
 */
export const validateScheduledFor = (requested, settings, now = new Date()) => {
  if (!requested) return undefined;

  if (!settings?.scheduling?.enabled) {
    throw badRequest("Scheduled orders are not currently available");
  }

  const when = new Date(requested);
  if (Number.isNaN(when.getTime())) {
    throw badRequest("scheduledFor must be a valid date");
  }

  const minMs = (settings.scheduling.minMinutesAhead ?? 0) * 60_000;
  if (when.getTime() - now.getTime() < minMs) {
    throw badRequest(
      `Scheduled orders need at least ${settings.scheduling.minMinutesAhead} minutes' notice`
    );
  }

  const maxMs = (settings.scheduling.maxDaysAhead ?? 7) * 24 * 60 * 60_000;
  if (when.getTime() - now.getTime() > maxMs) {
    throw badRequest(
      `Orders can only be scheduled up to ${settings.scheduling.maxDaysAhead} days ahead`
    );
  }

  // The restaurant has to actually be open when the order is due.
  const openThen = getOpenState(settings, when);
  if (!openThen.isOpen) {
    throw badRequest(
      `We are closed at that time.${openThen.nextOpen ? ` Next open: ${openThen.nextOpen}.` : ""}`
    );
  }

  return slotFor(when);
};

/**
 * Refuse a slot that is already full, so the kitchen is not handed twenty
 * orders due at the same minute.
 */
export const assertSlotCapacity = async (slot, settings, Order) => {
  const capacity = settings?.scheduling?.ordersPerSlot ?? 0;
  if (!slot || capacity <= 0) return;

  const end = new Date(slot.getTime() + SLOT_MINUTES * 60_000);
  const taken = await Order.countDocuments({
    scheduledFor: { $gte: slot, $lt: end },
    status: { $nin: ["cancelled", "rejected"] },
  });

  if (taken >= capacity) {
    throw badRequest("That time slot is fully booked. Please choose another.");
  }
};

export { SLOT_MINUTES };
