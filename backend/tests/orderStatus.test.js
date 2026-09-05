import test from "node:test";
import assert from "node:assert/strict";
import {
  ORDER_STATUSES,
  TERMINAL_STATUSES,
  CUSTOMER_CANCELLABLE,
  canTransition,
  nextStatuses,
  assertTransition,
  statusFromLegacy,
} from "../services/orderStatus.js";

test("the happy path for a delivery order walks end to end", () => {
  const path = ["placed", "accepted", "preparing", "ready", "out_for_delivery", "completed"];
  for (let i = 0; i < path.length - 1; i += 1) {
    assert.ok(
      canTransition(path[i], path[i + 1]),
      `${path[i]} -> ${path[i + 1]} should be allowed`
    );
  }
});

test("a pickup order can complete straight from ready", () => {
  assert.ok(canTransition("ready", "completed"));
});

test("statuses cannot be skipped", () => {
  assert.equal(canTransition("placed", "completed"), false);
  assert.equal(canTransition("placed", "preparing"), false);
  assert.equal(canTransition("accepted", "ready"), false);
});

test("terminal statuses are final", () => {
  for (const status of TERMINAL_STATUSES) {
    assert.deepEqual(nextStatuses(status), [], `${status} should be terminal`);
    assert.throws(
      () => assertTransition(status, "preparing"),
      /can no longer be changed/,
      `${status} must not be reopenable`
    );
  }
});

test("an order cannot be un-cancelled", () => {
  assert.throws(() => assertTransition("cancelled", "accepted"), /can no longer be changed/);
  assert.throws(() => assertTransition("completed", "cancelled"), /can no longer be changed/);
});

test("transitioning to the same status is rejected", () => {
  assert.throws(() => assertTransition("preparing", "preparing"), /already preparing/);
});

test("an unknown status is rejected with the valid list", () => {
  assert.throws(() => assertTransition("placed", "on_fire"), /Unknown status/);
  assert.throws(() => assertTransition("placed", "on_fire"), /placed, accepted/);
});

test("the error names what is actually allowed next", () => {
  assert.throws(
    () => assertTransition("placed", "ready"),
    /Allowed next: accepted, rejected, cancelled/
  );
});

test("an order can be cancelled or rejected early", () => {
  assert.ok(canTransition("placed", "rejected"));
  assert.ok(canTransition("placed", "cancelled"));
  assert.ok(canTransition("accepted", "cancelled"));
  // Once it is out with a driver, rejecting makes no sense.
  assert.equal(canTransition("out_for_delivery", "rejected"), false);
});

test("customers may only cancel before the kitchen commits", () => {
  assert.deepEqual(CUSTOMER_CANCELLABLE, ["placed", "accepted"]);
  assert.ok(!CUSTOMER_CANCELLABLE.includes("preparing"));
});

test("legacy booleans map onto the new model", () => {
  assert.equal(statusFromLegacy(true), "completed");
  assert.equal(statusFromLegacy(false), "placed");
});

test("every status is reachable from placed", () => {
  const seen = new Set(["placed"]);
  const queue = ["placed"];
  while (queue.length) {
    for (const next of nextStatuses(queue.pop())) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  for (const status of ORDER_STATUSES) {
    assert.ok(seen.has(status), `${status} is unreachable — dead status`);
  }
});
