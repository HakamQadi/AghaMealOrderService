import { badRequest } from "../utils/HttpError.js";

const EARTH_RADIUS_KM = 6371;
const toRadians = (deg) => (deg * Math.PI) / 180;

/** Great-circle distance in kilometres between two [lng, lat] pairs. */
export const distanceKm = ([lng1, lat1], [lng2, lat2]) => {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const isValidCoordinatePair = (coords) =>
  Array.isArray(coords) &&
  coords.length === 2 &&
  coords.every((n) => typeof n === "number" && Number.isFinite(n)) &&
  coords[0] >= -180 &&
  coords[0] <= 180 &&
  coords[1] >= -90 &&
  coords[1] <= 90;

/**
 * Validate the delivery address on an incoming order.
 *
 * Delivery orders used to arrive with no address at all, so every one of them
 * cost a phone call. A delivery order without coordinates and a written
 * address line is now rejected outright.
 */
export const validateDeliveryLocation = (location, settings) => {
  if (!location) {
    throw badRequest("A delivery address is required for delivery orders");
  }

  const coordinates = location.coordinates;
  if (!isValidCoordinatePair(coordinates)) {
    throw badRequest(
      "A valid delivery location is required (coordinates as [longitude, latitude])"
    );
  }

  const address = String(location.address ?? "").trim();
  if (address.length < 5) {
    throw badRequest(
      "A written address is required — include building, floor and a nearby landmark"
    );
  }

  const origin = settings?.delivery?.restaurantLocation?.coordinates;

  // Radius enforcement stays off until the restaurant's own coordinates are
  // configured, otherwise every order would be measured from nowhere.
  if (settings?.delivery?.enforceRadius && isValidCoordinatePair(origin)) {
    const km = distanceKm(origin, coordinates);
    if (km > settings.delivery.radiusKm) {
      throw badRequest(
        `That address is ${km.toFixed(1)}km away, outside our ${
          settings.delivery.radiusKm
        }km delivery area`
      );
    }
  }

  return {
    type: "Point",
    coordinates,
    address,
    ...(location.note ? { note: String(location.note).slice(0, 500) } : {}),
  };
};

/** Delivery fee for an order of this type. Pickup is always free. */
export const deliveryFeeFor = (type, settings) =>
  type === "delivery" ? Number(settings?.delivery?.fee ?? 0) : 0;

/** Reject an order that does not meet the minimum basket value. */
export const assertMinimumOrder = (subtotal, type, settings) => {
  const minimum = Number(settings?.delivery?.minimumOrder ?? 0);
  if (type === "delivery" && minimum > 0 && subtotal < minimum) {
    throw badRequest(
      `Minimum order for delivery is ${minimum}. Your basket is ${subtotal}.`
    );
  }
};
