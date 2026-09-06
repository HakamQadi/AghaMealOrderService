import test from "node:test";
import assert from "node:assert/strict";
import { getOpenState, assertOpen, nowInZone } from "../services/businessHours.js";

const TZ = "Asia/Amman";
const day = (open, close, isClosed = false) => ({ open, close, isClosed });
const week = (entries) => ({ hours: { timezone: TZ, week: entries } });

// A fixed instant: 2026-09-06 is a Sunday. 12:00 UTC is 15:00 in Amman (UTC+3).
const SUNDAY_NOON_UTC = new Date("2026-09-06T12:00:00Z");
const SUNDAY_EARLY_UTC = new Date("2026-09-06T04:00:00Z"); // 07:00 Amman

test("nowInZone reports the local day and minute", () => {
  const { day: d, minutes } = nowInZone(TZ, SUNDAY_NOON_UTC);
  assert.equal(d, 0, "Sunday");
  assert.equal(minutes, 15 * 60);
});

test("open during business hours, closed outside them", () => {
  const schedule = week(Array.from({ length: 7 }, () => day(10 * 60, 23 * 60)));

  assert.equal(getOpenState(schedule, SUNDAY_NOON_UTC).isOpen, true);

  const early = getOpenState(schedule, SUNDAY_EARLY_UTC);
  assert.equal(early.isOpen, false);
  assert.match(early.reason, /closed/i);
  assert.equal(early.nextOpen, "Sunday 10:00");
});

test("a day marked closed stays closed all day", () => {
  const schedule = week(
    Array.from({ length: 7 }, (_, i) => day(10 * 60, 23 * 60, i === 0))
  );
  const state = getOpenState(schedule, SUNDAY_NOON_UTC);
  assert.equal(state.isOpen, false);
  assert.equal(state.nextOpen, "Monday 10:00");
});

test("hours that wrap past midnight stay open after 00:00", () => {
  // Open 18:00, close 02:00 the following morning.
  const schedule = week(Array.from({ length: 7 }, () => day(18 * 60, 2 * 60)));

  // 00:30 Amman on Monday = 21:30 UTC Sunday. Covered by Sunday's late shift.
  const afterMidnight = new Date("2026-09-06T21:30:00Z");
  assert.equal(getOpenState(schedule, afterMidnight).isOpen, true);

  // 15:00 Amman Sunday is before the 18:00 opening.
  assert.equal(getOpenState(schedule, SUNDAY_NOON_UTC).isOpen, false);

  // 19:00 Amman Sunday = 16:00 UTC, inside the shift.
  assert.equal(getOpenState(schedule, new Date("2026-09-06T16:00:00Z")).isOpen, true);
});

test("the manual pause overrides an otherwise open schedule", () => {
  const schedule = {
    ...week(Array.from({ length: 7 }, () => day(0, 1439))),
    ordersPaused: true,
    pausedMessage: "Kitchen is at capacity",
  };
  const state = getOpenState(schedule, SUNDAY_NOON_UTC);
  assert.equal(state.isOpen, false);
  assert.equal(state.reason, "Kitchen is at capacity");
});

test("a restaurant with no configured hours is treated as open", () => {
  assert.equal(getOpenState({}, SUNDAY_NOON_UTC).isOpen, true);
  assert.equal(getOpenState({ hours: { week: [] } }, SUNDAY_NOON_UTC).isOpen, true);
});

test("assertOpen throws a 503 carrying the next opening time", () => {
  const schedule = week(Array.from({ length: 7 }, () => day(10 * 60, 23 * 60)));
  try {
    assertOpen(schedule, SUNDAY_EARLY_UTC);
    assert.fail("should have thrown");
  } catch (err) {
    assert.equal(err.status, 503);
    assert.equal(err.details.nextOpen, "Sunday 10:00");
  }
  assert.doesNotThrow(() => assertOpen(schedule, SUNDAY_NOON_UTC));
});
