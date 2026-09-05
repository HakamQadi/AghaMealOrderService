import { Settings, getSettings } from "../model/SettingsModel.js";
import { getOpenState } from "../services/businessHours.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { badRequest } from "../utils/HttpError.js";

/**
 * Public settings the clients need in order to render prices, show the
 * delivery fee and know whether the restaurant is open. Deliberately a subset
 * — nothing here is sensitive, but there is no reason to ship internal fields.
 */
const getPublicSettings = asyncHandler(async (_req, res) => {
  const settings = await getSettings();
  const openState = getOpenState(settings);

  res.status(200).json({
    currency: settings.currency,
    delivery: {
      fee: settings.delivery.fee,
      minimumOrder: settings.delivery.minimumOrder,
      radiusKm: settings.delivery.radiusKm,
      enforceRadius: settings.delivery.enforceRadius,
    },
    hours: settings.hours,
    isOpen: openState.isOpen,
    ...(openState.reason ? { closedReason: openState.reason } : {}),
    ...(openState.nextOpen ? { nextOpen: openState.nextOpen } : {}),
  });
});

/** Full settings document, for the dashboard. */
const getAdminSettings = asyncHandler(async (_req, res) => {
  const settings = await getSettings();
  res.status(200).json({ settings });
});

const NUMERIC_PATHS = [
  ["currency", "decimals"],
  ["delivery", "fee"],
  ["delivery", "minimumOrder"],
  ["delivery", "radiusKm"],
];

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getSettings();
  const { currency, delivery, hours, ordersPaused, pausedMessage } = req.body;

  if (currency) {
    if (currency.code) settings.currency.code = String(currency.code).toUpperCase();
    if (currency.symbol?.en) settings.currency.symbol.en = currency.symbol.en;
    if (currency.symbol?.ar) settings.currency.symbol.ar = currency.symbol.ar;
    if (currency.decimals !== undefined) settings.currency.decimals = currency.decimals;
  }

  if (delivery) {
    if (delivery.fee !== undefined) settings.delivery.fee = delivery.fee;
    if (delivery.minimumOrder !== undefined) {
      settings.delivery.minimumOrder = delivery.minimumOrder;
    }
    if (delivery.radiusKm !== undefined) settings.delivery.radiusKm = delivery.radiusKm;
    if (delivery.enforceRadius !== undefined) {
      settings.delivery.enforceRadius = Boolean(delivery.enforceRadius);
    }
    if (delivery.restaurantLocation?.coordinates) {
      const coords = delivery.restaurantLocation.coordinates;
      if (
        !Array.isArray(coords) ||
        coords.length !== 2 ||
        coords.some((n) => typeof n !== "number" || !Number.isFinite(n))
      ) {
        throw badRequest("restaurantLocation.coordinates must be [longitude, latitude]");
      }
      settings.delivery.restaurantLocation = { type: "Point", coordinates: coords };
    }
  }

  if (hours) {
    if (hours.timezone) settings.hours.timezone = hours.timezone;
    if (hours.week) {
      if (!Array.isArray(hours.week) || hours.week.length !== 7) {
        throw badRequest("hours.week must contain exactly 7 entries, Sunday first");
      }
      settings.hours.week = hours.week;
    }
  }

  if (ordersPaused !== undefined) settings.ordersPaused = Boolean(ordersPaused);
  if (pausedMessage !== undefined) settings.pausedMessage = String(pausedMessage);

  // Guarding against a fee or radius arriving as a string like "abc", which
  // Mongoose would otherwise reject with an opaque cast error.
  for (const [group, field] of NUMERIC_PATHS) {
    const value = settings[group][field];
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
      throw badRequest(`${group}.${field} must be a non-negative number`);
    }
  }

  // enforceRadius without a configured origin would reject every address.
  if (
    settings.delivery.enforceRadius &&
    !settings.delivery.restaurantLocation?.coordinates?.length
  ) {
    throw badRequest(
      "Set the restaurant location before enabling delivery radius enforcement"
    );
  }

  await settings.save();
  res.status(200).json({ message: "Settings updated", settings });
});

export default { getPublicSettings, getAdminSettings, updateSettings };
export { Settings };
