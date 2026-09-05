import mongoose from "mongoose";

/**
 * Single document holding operational configuration: currency, delivery rules
 * and opening hours. Previously these were hardcoded constants scattered
 * across the clients (a "$" here, a `deliveryFee = 1` there), which meant the
 * business could not change them without a release.
 */
const dayHoursSchema = new mongoose.Schema(
  {
    // Minutes from midnight, local time. 0 = 00:00, 1439 = 23:59.
    open: { type: Number, min: 0, max: 1439, default: 10 * 60 },
    close: { type: Number, min: 0, max: 1439, default: 23 * 60 },
    isClosed: { type: Boolean, default: false },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    // Enforces the singleton: only one document can hold this key.
    key: {
      type: String,
      default: "global",
      unique: true,
      immutable: true,
    },

    currency: {
      code: { type: String, default: "JOD" },
      // Displayed symbol. Bilingual because the app renders Arabic and English.
      symbol: {
        en: { type: String, default: "JD" },
        ar: { type: String, default: "د.أ" },
      },
      // JOD is subdivided into 1000 fils, but menu prices here are written to
      // two places (e.g. 7.95), so that is the display default.
      decimals: { type: Number, min: 0, max: 3, default: 2 },
    },

    delivery: {
      fee: { type: Number, default: 0, min: 0 },
      minimumOrder: { type: Number, default: 0, min: 0 },
      radiusKm: { type: Number, default: 10, min: 0 },
      // Orders are rejected beyond radiusKm from here. Must be set to the
      // real restaurant location before delivery validation is meaningful.
      restaurantLocation: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: undefined }, // [lng, lat]
      },
      enforceRadius: { type: Boolean, default: false },
    },

    hours: {
      // IANA timezone used to interpret the open/close minutes.
      timezone: { type: String, default: "Asia/Amman" },
      // Index 0 = Sunday, matching JavaScript's Date#getDay().
      week: {
        type: [dayHoursSchema],
        default: () => Array.from({ length: 7 }, () => ({})),
        validate: {
          validator: (v) => v.length === 7,
          message: "hours.week must contain exactly 7 entries (Sunday first)",
        },
      },
    },

    loyalty: {
      enabled: { type: Boolean, default: false },
      // Points earned per unit of currency spent (e.g. 1 = 1 point per JOD).
      pointsPerCurrencyUnit: { type: Number, default: 1, min: 0 },
      // Currency each point is worth when redeemed (e.g. 0.01 = 100pts -> 1 JOD).
      currencyPerPoint: { type: Number, default: 0.01, min: 0 },
      minimumRedemption: { type: Number, default: 100, min: 0 },
    },

    // Pre-orders for a later time slot.
    scheduling: {
      enabled: { type: Boolean, default: false },
      // How far ahead an order may be placed.
      maxDaysAhead: { type: Number, default: 7, min: 0 },
      // Earliest lead time, so the kitchen is not ambushed.
      minMinutesAhead: { type: Number, default: 30, min: 0 },
      // Orders allowed per 30-minute slot; 0 means unlimited.
      ordersPerSlot: { type: Number, default: 0, min: 0 },
    },

    // Manual kill switch for when the kitchen is overwhelmed. Overrides hours.
    ordersPaused: { type: Boolean, default: false },
    pausedMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

/**
 * Read the settings document, creating it with defaults on first use so the
 * API never has to cope with settings being absent.
 */
export const getSettings = async () => {
  const existing = await Settings.findOne({ key: "global" });
  if (existing) return existing;
  return Settings.create({ key: "global" });
};

export { Settings };
