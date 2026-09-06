import test from "node:test";
import assert from "node:assert/strict";
import {
  distanceKm,
  validateDeliveryLocation,
  deliveryFeeFor,
  assertMinimumOrder,
} from "../services/delivery.js";

// Amman city centre, and a point ~4km away.
const RESTAURANT = [35.9106, 31.9539];
const NEARBY = [35.9500, 31.9700];
const FAR = [36.5000, 32.5000];

const settings = (overrides = {}) => ({
  delivery: {
    fee: 1.5,
    minimumOrder: 5,
    radiusKm: 10,
    enforceRadius: false,
    restaurantLocation: { type: "Point", coordinates: RESTAURANT },
    ...overrides,
  },
});

const address = (coords = NEARBY) => ({
  coordinates: coords,
  address: "Building 12, floor 3, next to the pharmacy",
});

test("distance is computed correctly", () => {
  assert.equal(Math.round(distanceKm(RESTAURANT, RESTAURANT)), 0);
  const km = distanceKm(RESTAURANT, NEARBY);
  assert.ok(km > 3 && km < 6, `expected ~4km, got ${km}`);
});

test("a delivery order with no location is rejected", () => {
  assert.throws(() => validateDeliveryLocation(undefined, settings()), /address is required/i);
  assert.throws(() => validateDeliveryLocation(null, settings()), /address is required/i);
});

test("coordinates must be a valid [lng, lat] pair", () => {
  const bad = [
    { coordinates: [], address: "somewhere useful" },
    { coordinates: [1], address: "somewhere useful" },
    { coordinates: ["a", "b"], address: "somewhere useful" },
    { coordinates: [200, 100], address: "somewhere useful" },
    { coordinates: [35.9, NaN], address: "somewhere useful" },
  ];
  for (const location of bad) {
    assert.throws(
      () => validateDeliveryLocation(location, settings()),
      /valid delivery location/i,
      `should reject ${JSON.stringify(location.coordinates)}`
    );
  }
});

test("a written address line is required alongside coordinates", () => {
  assert.throws(
    () => validateDeliveryLocation({ coordinates: NEARBY }, settings()),
    /written address/i
  );
  assert.throws(
    () => validateDeliveryLocation({ coordinates: NEARBY, address: "  x " }, settings()),
    /written address/i
  );
});

test("a complete address is accepted and normalised", () => {
  const result = validateDeliveryLocation(
    { ...address(), note: "Call on arrival" },
    settings()
  );
  assert.equal(result.type, "Point");
  assert.deepEqual(result.coordinates, NEARBY);
  assert.equal(result.note, "Call on arrival");
});

test("radius is enforced only when switched on", () => {
  // Off by default: a far address still goes through.
  assert.ok(validateDeliveryLocation(address(FAR), settings()));

  assert.throws(
    () => validateDeliveryLocation(address(FAR), settings({ enforceRadius: true })),
    /outside our 10km delivery area/
  );

  // Within radius is fine.
  assert.ok(
    validateDeliveryLocation(address(NEARBY), settings({ enforceRadius: true }))
  );
});

test("radius enforcement is skipped when the restaurant location is unset", () => {
  const noOrigin = settings({ enforceRadius: true, restaurantLocation: undefined });
  assert.ok(
    validateDeliveryLocation(address(FAR), noOrigin),
    "must not reject every order just because the origin was never configured"
  );
});

test("pickup is free, delivery is charged", () => {
  assert.equal(deliveryFeeFor("pickup", settings()), 0);
  assert.equal(deliveryFeeFor("delivery", settings()), 1.5);
});

test("minimum order applies to delivery only", () => {
  assert.throws(() => assertMinimumOrder(3, "delivery", settings()), /Minimum order/);
  assert.doesNotThrow(() => assertMinimumOrder(3, "pickup", settings()));
  assert.doesNotThrow(() => assertMinimumOrder(5, "delivery", settings()));
});
