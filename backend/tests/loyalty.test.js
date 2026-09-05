import test from "node:test";
import assert from "node:assert/strict";
import { pointsFor, pointsValue } from "../services/loyalty.js";
import { effectivePrice } from "../services/priceCart.js";

const settings = (overrides = {}) => ({
  loyalty: {
    enabled: true,
    pointsPerCurrencyUnit: 1,
    currencyPerPoint: 0.01,
    minimumRedemption: 100,
    ...overrides,
  },
});

test("points are earned on the food subtotal, not the delivery fee", () => {
  const order = { subtotal: 20, deliveryFee: 5, totalPrice: 25 };
  assert.equal(pointsFor(order, settings()), 20, "the 5 fee must not earn points");
});

test("points are whole numbers, always rounded down", () => {
  assert.equal(pointsFor({ subtotal: 7.95 }, settings()), 7);
  assert.equal(pointsFor({ subtotal: 0.5 }, settings()), 0);
});

test("no points are earned when loyalty is switched off", () => {
  assert.equal(pointsFor({ subtotal: 100 }, settings({ pointsPerCurrencyUnit: 0 })), 0);
  assert.equal(pointsFor({ subtotal: 100 }, {}), 0);
});

test("points convert to currency at the configured rate", () => {
  assert.equal(pointsValue(100, settings()), 1);
  assert.equal(pointsValue(250, settings()), 2.5);
  assert.equal(pointsValue(0, settings()), 0);
});

test("point value is rounded to fils", () => {
  const value = pointsValue(333, settings({ currencyPerPoint: 0.00333 }));
  assert.equal(value, Math.round(value * 1000) / 1000);
});

test("a promotional price is used when it is live and cheaper", () => {
  const meal = { price: 10, promoPrice: 7 };
  assert.equal(effectivePrice(meal), 7);
});

test("an expired promotion falls back to the list price", () => {
  const meal = {
    price: 10,
    promoPrice: 7,
    promoEndsAt: new Date("2020-01-01"),
  };
  assert.equal(effectivePrice(meal), 10, "a finished promo must not still apply");
});

test("a promotion still running is honoured", () => {
  const meal = {
    price: 10,
    promoPrice: 7,
    promoEndsAt: new Date(Date.now() + 86_400_000),
  };
  assert.equal(effectivePrice(meal), 7);
});

test("a promo that is not cheaper is ignored", () => {
  assert.equal(effectivePrice({ price: 10, promoPrice: 12 }), 10);
  assert.equal(effectivePrice({ price: 10, promoPrice: 10 }), 10);
});

test("a missing or malformed promo price is ignored", () => {
  assert.equal(effectivePrice({ price: 10 }), 10);
  assert.equal(effectivePrice({ price: 10, promoPrice: null }), 10);
  assert.equal(effectivePrice({ price: 10, promoPrice: undefined }), 10);
});

test("the loyalty deduction happens before the user is persisted", async () => {
  // Regression guard. The deduction was originally written after
  // `await user.save()`, so points were discounted on the order but never
  // taken off the balance — the same points could be spent indefinitely.
  // This asserts the source order rather than the runtime, because
  // reproducing it live needs a database.
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(
    new URL("../controller/OrderController.js", import.meta.url),
    "utf8"
  );

  const createOrder = source.slice(
    source.indexOf("const createOrder"),
    source.indexOf("const getAllOrdersAndById")
  );

  const deduction = createOrder.indexOf("user.loyaltyPoints = Math.max(");
  const save = createOrder.indexOf("await user.save()");

  assert.ok(deduction > -1, "the deduction should exist in createOrder");
  assert.ok(save > -1, "createOrder should save the user");
  assert.ok(
    deduction < save,
    "loyaltyPoints must be decremented before user.save(), or the spend is lost"
  );
});
