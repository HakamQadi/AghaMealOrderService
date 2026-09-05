/**
 * Order lifecycle as the app renders it. Mirrors
 * backend/services/orderStatus.js — the server is the authority.
 *
 * The screens already rendered "preparing" / "on the way" / "cancelled"
 * before the backend could produce them; the boolean it did have collapsed
 * everything to two states. These are the real ones.
 */
export const STATUS_LABELS = {
  placed: "Placed",
  accepted: "Accepted",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "On the way",
  completed: "Delivered",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

export const STATUS_COLORS = {
  placed: "#FF9800",
  accepted: "#2196F3",
  preparing: "#FF9800",
  ready: "#7E57C2",
  out_for_delivery: "#2196F3",
  completed: "#4CAF50",
  cancelled: "#F44336",
  rejected: "#F44336",
};

export const STATUS_ICONS = {
  placed: "time",
  accepted: "checkmark-circle-outline",
  preparing: "restaurant",
  ready: "bag-check",
  out_for_delivery: "car",
  completed: "checkmark-circle",
  cancelled: "close-circle",
  rejected: "close-circle",
};

/** A customer may pull out only before the kitchen commits. */
export const CUSTOMER_CANCELLABLE = ["placed", "accepted"];

export const canCancel = (status) => CUSTOMER_CANCELLABLE.includes(status);

/**
 * Read an order's status, tolerating documents written before the lifecycle
 * existed (which carry only `isDelivered`).
 */
export const statusOf = (order) =>
  order?.status ?? (order?.isDelivered ? "completed" : "placed");

export const labelOf = (order) => STATUS_LABELS[statusOf(order)] ?? "Placed";
export const colorOf = (order) => STATUS_COLORS[statusOf(order)] ?? "#666";
export const iconOf = (order) => STATUS_ICONS[statusOf(order)] ?? "time";
