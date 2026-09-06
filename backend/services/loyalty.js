import { getSettings } from "../model/SettingsModel.js";
import { badRequest } from "../utils/HttpError.js";

/**
 * Loyalty points.
 *
 * Deliberately simple and server-computed: points are earned only when an
 * order actually completes, and redeemed only against a real basket. Rates
 * live in Settings so the business can tune them without a release.
 */

export const pointsFor = (order, settings) => {
  const perUnit = settings?.loyalty?.pointsPerCurrencyUnit ?? 0;
  if (perUnit <= 0) return 0;
  // Earn on what the customer actually spent on food, not on the delivery fee.
  const base = order.subtotal ?? order.totalPrice ?? 0;
  return Math.floor(base * perUnit);
};

/** Currency value of a number of points. */
export const pointsValue = (points, settings) => {
  const rate = settings?.loyalty?.currencyPerPoint ?? 0;
  return Math.round(points * rate * 1000) / 1000;
};

/**
 * Award points for a completed order. Idempotent by design: the caller only
 * invokes it on the transition into `completed`, and the flag on the order
 * stops a re-run from paying twice.
 */
export const awardPoints = async (order, user) => {
  if (!user || order.loyaltyAwarded) return { awarded: 0 };

  const settings = await getSettings();
  if (!settings?.loyalty?.enabled) return { awarded: 0 };

  const points = pointsFor(order, settings);
  if (points <= 0) return { awarded: 0 };

  user.loyaltyPoints = (user.loyaltyPoints ?? 0) + points;
  await user.save();

  order.loyaltyAwarded = points;
  await order.save();

  return { awarded: points, balance: user.loyaltyPoints };
};

/**
 * Convert points into a discount on a basket.
 *
 * Returns the points to spend and what they are worth, clamped so a
 * redemption can never exceed the basket or the customer's balance.
 */
export const redeemPoints = async (requestedPoints, subtotal, user) => {
  const settings = await getSettings();

  if (!settings?.loyalty?.enabled) {
    throw badRequest("Loyalty points are not currently available");
  }

  const points = Math.floor(Number(requestedPoints));
  if (!Number.isFinite(points) || points <= 0) {
    throw badRequest("Enter how many points you want to use");
  }

  const minimum = settings.loyalty.minimumRedemption ?? 0;
  if (points < minimum) {
    throw badRequest(`You need at least ${minimum} points to redeem`);
  }

  const balance = user?.loyaltyPoints ?? 0;
  if (points > balance) {
    throw badRequest(`You only have ${balance} points`);
  }

  const value = pointsValue(points, settings);
  if (value <= 0) throw badRequest("Those points have no value on this order");

  // Never discount more than the basket is worth; spend only the points that
  // were actually used, so the remainder stays on the balance.
  if (value > subtotal) {
    const rate = settings.loyalty.currencyPerPoint;
    const affordable = Math.floor(subtotal / rate);
    return { points: affordable, value: pointsValue(affordable, settings) };
  }

  return { points, value };
};
