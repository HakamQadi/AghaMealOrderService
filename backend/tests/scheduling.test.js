import test from "node:test";
import assert from "node:assert/strict";
import { slotFor, validateScheduledFor } from "../services/scheduling.js";

const openAllWeek = Array.from({ length: 7 }, () => ({
  open: 0,
  close: 1439,
  isClosed: false,
}));

const settings = (overrides = {}) => ({
  scheduling: {
    enabled: true,
    maxDaysAhead: 7,
    minMinutesAhead: 30,
    ordersPerSlot: 0,
    ...overrides,
  },
  hours: { timezone: "Asia/Amman", week: openAllWeek },
});

const NOW = new Date("2026-09-06T12:00:00Z");
const inMinutes = (n) => new Date(NOW.getTime() + n * 60_000);

test("no scheduled time means an ASAP order", () => {
  assert.equal(validateScheduledFor(undefined, settings(), NOW), undefined);
  assert.equal(validateScheduledFor(null, settings(), NOW), undefined);
});

test("times are snapped down to a 30 minute slot", () => {
  assert.equal(slotFor(new Date("2026-09-06T12:17:45Z")).toISOString(), "2026-09-06T12:00:00.000Z");
  assert.equal(slotFor(new Date("2026-09-06T12:47:00Z")).toISOString(), "2026-09-06T12:30:00.000Z");
});

test("scheduling is refused when the feature is off", () => {
  assert.throws(
    () => validateScheduledFor(inMinutes(120), settings({ enabled: false }), NOW),
    /not currently available/
  );
});

test("an order too soon is refused so the kitchen is not ambushed", () => {
  assert.throws(() => validateScheduledFor(inMinutes(5), settings(), NOW), /30 minutes/);
  assert.doesNotThrow(() => validateScheduledFor(inMinutes(60), settings(), NOW));
});

test("an order too far ahead is refused", () => {
  assert.throws(
    () => validateScheduledFor(inMinutes(60 * 24 * 30), settings(), NOW),
    /up to 7 days/
  );
});

test("a time in the past is refused", () => {
  assert.throws(() => validateScheduledFor(inMinutes(-120), settings(), NOW), /notice/);
});

test("a malformed date is refused", () => {
  assert.throws(() => validateScheduledFor("not-a-date", settings(), NOW), /valid date/);
});

test("a slot when the restaurant is closed is refused", () => {
  const closedSundays = settings();
  closedSundays.hours.week = openAllWeek.map((d, i) =>
    i === 0 ? { ...d, isClosed: true } : d
  );
  // NOW is a Sunday; +2h is still Sunday in Amman.
  assert.throws(
    () => validateScheduledFor(inMinutes(120), closedSundays, NOW),
    /closed at that time/
  );
});
