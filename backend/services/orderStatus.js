import { badRequest } from "../utils/HttpError.js";

/**
 * Order lifecycle.
 *
 * The whole fulfilment model used to be a single `isDelivered` boolean, so
 * staff could not reject an order, customers could not cancel one, and a new
 * order looked identical to one already in the kitchen. The customer app was
 * already rendering "preparing" / "on the way" / "cancelled" against a model
 * that could not produce them.
 */
export const ORDER_STATUSES = [
  "placed",
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
  "completed",
  "cancelled",
  "rejected",
];

export const TERMINAL_STATUSES = ["completed", "cancelled", "rejected"];

/** Statuses reachable from each status. Terminal states go nowhere. */
const TRANSITIONS = {
  placed: ["accepted", "rejected", "cancelled"],
  accepted: ["preparing", "cancelled", "rejected"],
  preparing: ["ready", "cancelled"],
  // Pickup orders complete from `ready`; delivery orders go out first.
  ready: ["out_for_delivery", "completed", "cancelled"],
  out_for_delivery: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
  rejected: [],
};

/** A customer may only pull out before the kitchen has committed to the order. */
export const CUSTOMER_CANCELLABLE = ["placed", "accepted"];

export const isValidStatus = (status) => ORDER_STATUSES.includes(status);

export const canTransition = (from, to) => (TRANSITIONS[from] ?? []).includes(to);

export const nextStatuses = (from) => TRANSITIONS[from] ?? [];

/**
 * Validate a status change, throwing a message that says what is actually
 * allowed rather than a bare rejection.
 */
export const assertTransition = (from, to) => {
  if (!isValidStatus(to)) {
    throw badRequest(`Unknown status "${to}". Expected one of: ${ORDER_STATUSES.join(", ")}`);
  }
  if (from === to) {
    throw badRequest(`Order is already ${to}`);
  }
  if (TERMINAL_STATUSES.includes(from)) {
    throw badRequest(`Order is ${from} and can no longer be changed`);
  }
  if (!canTransition(from, to)) {
    const allowed = nextStatuses(from);
    throw badRequest(
      allowed.length
        ? `Cannot go from ${from} to ${to}. Allowed next: ${allowed.join(", ")}`
        : `Order is ${from} and can no longer be changed`
    );
  }
};

/** Human label, shared so the dashboard and app agree on wording. */
export const STATUS_LABELS = {
  placed: "New",
  accepted: "Accepted",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "On the way",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

/** Map a legacy isDelivered boolean onto the new model. */
export const statusFromLegacy = (isDelivered) => (isDelivered ? "completed" : "placed");
