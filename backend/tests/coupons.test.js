import test from "node:test";
import assert from "node:assert/strict";
import { computeDiscount } from "../services/coupons.js";

const percentage = (value, maxDiscount) => ({ type: "percentage", value, maxDiscount });
const fixed = (value) => ({ type: "fixed", value });

test("a percentage discount is computed off the subtotal", () => {
  assert.equal(computeDiscount(percentage(20), 50), 10);
  assert.equal(computeDiscount(percentage(10), 7.95), 0.795);
});

test("a fixed discount is taken at face value", () => {
  assert.equal(computeDiscount(fixed(3), 20), 3);
});

test("maxDiscount caps a percentage coupon", () => {
  // "20% off, up to 5" on a 100 basket is 5, not 20.
  assert.equal(computeDiscount(percentage(20, 5), 100), 5);
  // Under the cap it behaves normally.
  assert.equal(computeDiscount(percentage(20, 5), 10), 2);
});

test("a discount can never exceed the subtotal", () => {
  // This is exactly how a total was driven negative before.
  assert.equal(computeDiscount(fixed(999), 10), 10);
  assert.equal(computeDiscount(percentage(100), 25), 25);
});

test("a discount is never negative", () => {
  assert.equal(computeDiscount(fixed(-50), 10), 0);
  assert.equal(computeDiscount(percentage(-20), 10), 0);
});

test("the resulting total never goes below zero", () => {
  for (const coupon of [fixed(999), percentage(100), fixed(10.5)]) {
    const subtotal = 10;
    const total = subtotal - computeDiscount(coupon, subtotal);
    assert.ok(total >= 0, `total went negative with ${JSON.stringify(coupon)}`);
  }
});

test("money is rounded to fils, not left as float noise", () => {
  // 0.1 + 0.2 style drift must not reach the database.
  const discount = computeDiscount(percentage(33.333), 10);
  assert.equal(discount, Math.round(discount * 1000) / 1000);
  assert.ok(String(discount).split(".")[1]?.length <= 3);
});

test("a zero-value basket yields no discount", () => {
  assert.equal(computeDiscount(percentage(50), 0), 0);
  assert.equal(computeDiscount(fixed(5), 0), 0);
});
