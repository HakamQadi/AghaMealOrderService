/**
 * Client-side mirror of the server's order lifecycle. Kept in step with
 * backend/services/orderStatus.js — the server is the authority and rejects
 * anything illegal, this is only for rendering the right buttons.
 */
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

export const TERMINAL_STATUSES = ["completed", "cancelled", "rejected"];

export const ACTIVE_STATUSES = [
  "placed",
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
];

const TRANSITIONS = {
  placed: ["accepted", "rejected", "cancelled"],
  accepted: ["preparing", "cancelled", "rejected"],
  preparing: ["ready", "cancelled"],
  ready: ["out_for_delivery", "completed", "cancelled"],
  out_for_delivery: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
  rejected: [],
};

export const nextStatuses = (status) => TRANSITIONS[status] ?? [];

/** The single action staff take most often from each state. */
export const primaryNext = (status, type) => {
  if (status === "ready") return type === "delivery" ? "out_for_delivery" : "completed";
  const [first] = nextStatuses(status);
  return first === "rejected" || first === "cancelled" ? undefined : first;
};

export const STATUS_STYLES = {
  placed: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  accepted: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  preparing: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  ready: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  out_for_delivery: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  cancelled: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  rejected: "bg-red-500/15 text-red-300 border-red-500/30",
};

/** "12m" / "1h 20m" since the order was placed — the number that matters at service. */
export const elapsedSince = (iso) => {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
};
