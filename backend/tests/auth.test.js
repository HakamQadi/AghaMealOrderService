import test from "node:test";
import assert from "node:assert/strict";

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

const { signToken, readToken, requireAuth, requireAdmin, requireSelfOrAdmin } =
  await import("../middleware/auth.js");

const ADMIN = { _id: "111111111111111111111111", role: "admin" };
const CUSTOMER = { _id: "222222222222222222222222", role: "user" };

const reqWith = (token, params = {}) => ({
  headers: token ? { authorization: `Bearer ${token}` } : {},
  params,
});

/** Run a guard (single fn or array of fns) and capture how it finished. */
const run = async (guard, req) => {
  const chain = Array.isArray(guard) ? guard : [guard];
  for (const fn of chain) {
    let outcome = "pending";
    let error;
    await new Promise((resolve) => {
      fn(req, {}, (err) => {
        if (err) {
          outcome = "error";
          error = err;
        } else {
          outcome = "next";
        }
        resolve();
      });
    });
    if (outcome === "error") return { status: error.status, message: error.message };
  }
  return { status: 200 };
};

test("a valid token round-trips", () => {
  const payload = readToken(reqWith(signToken(ADMIN)));
  assert.equal(payload.userId, String(ADMIN._id));
  assert.equal(payload.role, "admin");
});

test("readToken returns null for junk rather than throwing", () => {
  assert.equal(readToken(reqWith("not-a-jwt")), null);
  assert.equal(readToken({ headers: {} }), null);
  assert.equal(readToken({ headers: { authorization: "Basic abc" } }), null);
});

test("a token signed with the wrong secret is rejected", async () => {
  const jwt = (await import("jsonwebtoken")).default;
  const forged = jwt.sign({ userId: "x", role: "admin" }, "wrong-secret");
  assert.equal(readToken(reqWith(forged)), null);
});

test("requireAuth rejects an anonymous request with 401", async () => {
  assert.equal((await run(requireAuth, reqWith(null))).status, 401);
  assert.equal((await run(requireAuth, reqWith(signToken(CUSTOMER)))).status, 200);
});

test("requireAdmin rejects a customer with 403 and an anonymous caller with 401", async () => {
  assert.equal((await run(requireAdmin, reqWith(null))).status, 401);
  assert.equal((await run(requireAdmin, reqWith(signToken(CUSTOMER)))).status, 403);
  assert.equal((await run(requireAdmin, reqWith(signToken(ADMIN)))).status, 200);
});

test("a customer cannot read another customer's orders", async () => {
  const guard = requireSelfOrAdmin("userId");
  const token = signToken(CUSTOMER);

  const own = await run(guard, reqWith(token, { userId: String(CUSTOMER._id) }));
  assert.equal(own.status, 200);

  const other = await run(guard, reqWith(token, { userId: String(ADMIN._id) }));
  assert.equal(other.status, 403);

  const staff = await run(
    guard,
    reqWith(signToken(ADMIN), { userId: String(CUSTOMER._id) })
  );
  assert.equal(staff.status, 200, "admins may read any history");
});
