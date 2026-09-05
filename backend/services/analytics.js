import { Order } from "../model/OrderModel.js";
import { User } from "../model/userModel.js";

/**
 * Business metrics, computed from the orders already in the database.
 *
 * The dashboard used to show three counts — number of meals, number of
 * categories, number of orders ever placed. None of those are numbers anyone
 * runs a restaurant on. Everything here comes from existing documents; no new
 * data capture was needed.
 */

// Only completed orders count as revenue — a cancelled order is not money.
const REVENUE_MATCH = { status: "completed" };

const round = (n) => Math.round((n ?? 0) * 1000) / 1000;

export const periodRange = (period = "today", now = new Date()) => {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (period === "week") start.setDate(start.getDate() - 6);
  else if (period === "month") start.setDate(start.getDate() - 29);
  else if (period === "all") return { start: new Date(0), end: now };

  return { start, end: now };
};

/** Headline figures plus the same window immediately before, for comparison. */
export const getSummary = async (period = "today") => {
  const { start, end } = periodRange(period);
  const windowMs = end.getTime() - start.getTime();
  const prevStart = new Date(start.getTime() - windowMs);

  const summarise = async (from, to) => {
    const [result] = await Order.aggregate([
      { $match: { ...REVENUE_MATCH, createdAt: { $gte: from, $lte: to } } },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
          discounts: { $sum: { $ifNull: ["$discountAmount", 0] } },
          deliveryFees: { $sum: { $ifNull: ["$deliveryFee", 0] } },
        },
      },
    ]);
    const revenue = round(result?.revenue);
    const orders = result?.orders ?? 0;
    return {
      revenue,
      orders,
      averageOrderValue: orders ? round(revenue / orders) : 0,
      discounts: round(result?.discounts),
      deliveryFees: round(result?.deliveryFees),
    };
  };

  const [current, previous, statusBreakdown, typeBreakdown] = await Promise.all([
    summarise(start, end),
    summarise(prevStart, start),
    Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { ...REVENUE_MATCH, createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: "$type", count: { $sum: 1 }, revenue: { $sum: "$totalPrice" } } },
    ]),
  ]);

  const change = (now, before) =>
    before > 0 ? Math.round(((now - before) / before) * 1000) / 10 : null;

  const placed = statusBreakdown.reduce((sum, s) => sum + s.count, 0);
  const lost = statusBreakdown
    .filter((s) => s._id === "cancelled" || s._id === "rejected")
    .reduce((sum, s) => sum + s.count, 0);

  return {
    period,
    range: { start, end },
    current,
    previous,
    change: {
      revenue: change(current.revenue, previous.revenue),
      orders: change(current.orders, previous.orders),
      averageOrderValue: change(current.averageOrderValue, previous.averageOrderValue),
    },
    statusBreakdown: Object.fromEntries(statusBreakdown.map((s) => [s._id, s.count])),
    fulfilment: {
      total: placed,
      lost,
      // The share of orders that never turned into money.
      lossRate: placed ? Math.round((lost / placed) * 1000) / 10 : 0,
    },
    typeBreakdown: typeBreakdown.map((t) => ({
      type: t._id,
      count: t.count,
      revenue: round(t.revenue),
    })),
  };
};

/** Best and worst sellers — the menu decision. */
export const getMenuPerformance = async (period = "month", limit = 10) => {
  const { start, end } = periodRange(period);

  const rows = await Order.aggregate([
    { $match: { ...REVENUE_MATCH, createdAt: { $gte: start, $lte: end } } },
    { $unwind: "$cartItems" },
    {
      $group: {
        _id: "$cartItems.name.en",
        nameAr: { $first: "$cartItems.name.ar" },
        units: { $sum: "$cartItems.quantity" },
        revenue: { $sum: { $multiply: ["$cartItems.price", "$cartItems.quantity"] } },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  const shaped = rows.map((r) => ({
    name: { en: r._id, ar: r.nameAr },
    units: r.units,
    revenue: round(r.revenue),
  }));

  return {
    period,
    top: shaped.slice(0, limit),
    bottom: shaped.slice(-limit).reverse(),
    totalItemsSold: shaped.reduce((sum, r) => sum + r.units, 0),
  };
};

/** Orders by hour and weekday — the staffing decision. */
export const getDemandProfile = async (period = "month") => {
  const { start, end } = periodRange(period);
  const timezone = "Asia/Amman";

  const [byHour, byWeekday] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: { $hour: { date: "$createdAt", timezone } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dayOfWeek: { date: "$createdAt", timezone } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return {
    period,
    byHour: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: byHour.find((h) => h._id === hour)?.count ?? 0,
    })),
    // $dayOfWeek is 1-indexed from Sunday.
    byWeekday: days.map((day, i) => ({
      day,
      count: byWeekday.find((d) => d._id === i + 1)?.count ?? 0,
    })),
  };
};

/** New versus returning customers. */
export const getCustomerMetrics = async (period = "month") => {
  const { start, end } = periodRange(period);

  const [totalCustomers, newCustomers, repeatRows] = await Promise.all([
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "user", createdAt: { $gte: start, $lte: end } }),
    Order.aggregate([
      { $match: { ...REVENUE_MATCH, user: { $ne: null } } },
      { $group: { _id: "$user", orders: { $sum: 1 } } },
      {
        $group: {
          _id: null,
          customers: { $sum: 1 },
          repeat: { $sum: { $cond: [{ $gt: ["$orders", 1] }, 1, 0] } },
        },
      },
    ]),
  ]);

  const stats = repeatRows[0] ?? { customers: 0, repeat: 0 };

  return {
    period,
    totalCustomers,
    newCustomers,
    orderingCustomers: stats.customers,
    repeatCustomers: stats.repeat,
    repeatRate: stats.customers
      ? Math.round((stats.repeat / stats.customers) * 1000) / 10
      : 0,
  };
};

/** Flat rows for CSV export. */
export const getOrdersForExport = async (period = "month") => {
  const { start, end } = periodRange(period);

  return Order.find({ createdAt: { $gte: start, $lte: end } })
    .sort({ createdAt: -1 })
    .select(
      "createdAt name contact type status subtotal discountAmount deliveryFee totalPrice couponCode paymentMethod paymentStatus"
    )
    .lean();
};
