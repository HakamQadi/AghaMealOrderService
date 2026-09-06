import {
  getSummary,
  getMenuPerformance,
  getDemandProfile,
  getCustomerMetrics,
  getOrdersForExport,
} from "../services/analytics.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { badRequest } from "../utils/HttpError.js";

const PERIODS = ["today", "week", "month", "all"];

const readPeriod = (req) => {
  const period = req.query.period ?? "today";
  if (!PERIODS.includes(period)) {
    throw badRequest(`period must be one of: ${PERIODS.join(", ")}`);
  }
  return period;
};

/** Everything the dashboard home page needs, in one round trip. */
const overview = asyncHandler(async (req, res) => {
  const period = readPeriod(req);

  const [summary, menu, demand, customers] = await Promise.all([
    getSummary(period),
    getMenuPerformance(period === "today" ? "week" : period, 5),
    getDemandProfile(period === "today" ? "week" : period),
    getCustomerMetrics(period),
  ]);

  res.status(200).json({ summary, menu, demand, customers });
});

const summary = asyncHandler(async (req, res) =>
  res.status(200).json(await getSummary(readPeriod(req)))
);

const menu = asyncHandler(async (req, res) =>
  res.status(200).json(
    await getMenuPerformance(readPeriod(req), Math.min(Number(req.query.limit) || 10, 50))
  )
);

const demand = asyncHandler(async (req, res) =>
  res.status(200).json(await getDemandProfile(readPeriod(req)))
);

const customers = asyncHandler(async (req, res) =>
  res.status(200).json(await getCustomerMetrics(readPeriod(req)))
);

const csvCell = (value) => {
  const text = value == null ? "" : String(value);
  // Quote anything that would otherwise break the column layout.
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/** CSV for the accountant. */
const exportOrders = asyncHandler(async (req, res) => {
  const period = readPeriod(req);
  const orders = await getOrdersForExport(period);

  const headers = [
    "date", "customer", "contact", "type", "status", "subtotal",
    "discount", "deliveryFee", "total", "coupon", "paymentMethod", "paymentStatus",
  ];

  const rows = orders.map((o) =>
    [
      new Date(o.createdAt).toISOString(),
      o.name, o.contact, o.type, o.status,
      o.subtotal ?? "", o.discountAmount ?? 0, o.deliveryFee ?? 0, o.totalPrice,
      o.couponCode ?? "", o.paymentMethod ?? "", o.paymentStatus ?? "",
    ].map(csvCell).join(",")
  );

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="orders-${period}-${new Date().toISOString().slice(0, 10)}.csv"`
  );
  // BOM so Excel opens the Arabic customer names correctly.
  res.send("﻿" + [headers.join(","), ...rows].join("\n"));
});

export default { overview, summary, menu, demand, customers, exportOrders };
