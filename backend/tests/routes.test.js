import test, { before, after } from "node:test";
import assert from "node:assert/strict";

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
delete process.env.ALLOW_LEGACY_UNAUTHED_ORDERS;

const { createApp } = await import("../app.js");
const { signToken } = await import("../middleware/auth.js");

let server;
let baseUrl;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server?.close());

const call = (path, { method = "GET", token, body } = {}) =>
  fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

const CUSTOMER_TOKEN = () => signToken({ _id: "222222222222222222222222", role: "user" });

test("health and ping are public", async () => {
  assert.equal((await call("/ping")).status, 200);
  assert.equal((await call("/health")).status, 200);
});

test("every menu-mutating route rejects an anonymous caller", async () => {
  const routes = [
    ["/admin/meals/add", "POST"],
    ["/admin/meals/update/aaaaaaaaaaaaaaaaaaaaaaaa", "PATCH"],
    ["/admin/meals/delete/aaaaaaaaaaaaaaaaaaaaaaaa", "DELETE"],
    ["/admin/categories/add", "POST"],
    ["/admin/categories/update/aaaaaaaaaaaaaaaaaaaaaaaa", "PATCH"],
    ["/admin/categories/delete/aaaaaaaaaaaaaaaaaaaaaaaa", "DELETE"],
  ];

  for (const [path, method] of routes) {
    const res = await call(path, { method });
    assert.equal(res.status, 401, `${method} ${path} should require auth`);
  }
});

test("a logged-in customer still cannot touch the menu", async () => {
  const res = await call("/admin/meals/delete/aaaaaaaaaaaaaaaaaaaaaaaa", {
    method: "DELETE",
    token: CUSTOMER_TOKEN(),
  });
  assert.equal(res.status, 403);
});

test("the order list is staff-only", async () => {
  assert.equal((await call("/admin/orders")).status, 401);
  assert.equal((await call("/admin/orders", { token: CUSTOMER_TOKEN() })).status, 403);
});

test("order deletion and status changes are staff-only", async () => {
  const del = await call("/admin/orders/delete/aaaaaaaaaaaaaaaaaaaaaaaa", {
    method: "DELETE",
    token: CUSTOMER_TOKEN(),
  });
  assert.equal(del.status, 403);

  const patch = await call("/admin/orders/update/aaaaaaaaaaaaaaaaaaaaaaaa", {
    method: "PATCH",
    token: CUSTOMER_TOKEN(),
    body: { isDelivered: true },
  });
  assert.equal(patch.status, 403);
});

test("a customer cannot read another customer's order history", async () => {
  const res = await call("/admin/orders/user/999999999999999999999999", {
    token: CUSTOMER_TOKEN(),
  });
  assert.equal(res.status, 403);
});

test("placing an order requires a token when the legacy flag is unset", async () => {
  const res = await call("/admin/orders/add", {
    method: "POST",
    body: { name: "x", contact: "0790000000", type: "pickup", cartItems: [] },
  });
  assert.equal(res.status, 401);
});

test("an unknown route returns a JSON 404, not an HTML stack", async () => {
  const res = await call("/does-not-exist");
  assert.equal(res.status, 404);
  assert.match(res.headers.get("content-type"), /application\/json/);
});

test("malformed JSON is a 400, not a 500", async () => {
  const res = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{ not json",
  });
  assert.equal(res.status, 400);
});

test("the legacy flag is honoured at request time, not import time", async () => {
  // Regression guard: this flag used to be read once at module scope, which
  // meant it was evaluated before dotenv.config() had run and so never took
  // effect no matter what .env said.
  const anonymousOrder = () =>
    call("/admin/orders/add", {
      method: "POST",
      body: { name: "x", contact: "0790000000", type: "pickup", cartItems: [] },
    });

  assert.equal((await anonymousOrder()).status, 401, "closed by default");

  process.env.ALLOW_LEGACY_UNAUTHED_ORDERS = "true";
  try {
    const res = await anonymousOrder();
    assert.notEqual(res.status, 401, "flag should let the request past the guard");
    assert.equal(res.status, 400, "and then fail validation on the empty cart");
  } finally {
    delete process.env.ALLOW_LEGACY_UNAUTHED_ORDERS;
  }

  assert.equal((await anonymousOrder()).status, 401, "closed again once unset");
});
