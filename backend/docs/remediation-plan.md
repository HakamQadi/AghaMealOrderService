# Agha Meal — Remediation Plan

**Date:** 2026-09-05
**Companion document:** [business-gap-analysis.md](./business-gap-analysis.md) — gap IDs below (C1, O2, …) refer to that document.

---

## Implementation status

_Last updated 2026-09-06._

| Item | Status |
|---|---|
| 0.1 Rotate leaked credentials | ⚠️ **Blocked — needs you.** Repo side done (`.gitignore`, `.env.example`); the Atlas / Render / ImageKit console rotations require your access |
| 0.2 Server-authoritative pricing | ✅ Done, tested |
| 0.3 Password reset disclosure | ✅ Done (token no longer returned, stored hashed, 10-min TTL). SMS delivery still outstanding — codes are logged server-side as a stopgap |
| 0.4 Auth + authorization | ✅ Done, tested |
| 0.5 Duplicate admin account | ⚠️ **Needs your decision** — `07789718044` still exists; deleting it is a production write |
| Privilege escalation via `register` | ✅ Done — **new gap, not in the original analysis** (see C4) |
| Hygiene items | ✅ Done (see below) |
| **1.1 Delivery address capture** | ✅ Done, tested |
| **1.2 Delivery fee, minimum order, radius** | ✅ Done, tested |
| **1.3 Currency configuration** | ✅ Done |
| **1.4 Business hours + pause switch** | ✅ Done, tested |
| **2.1 Order lifecycle** | ✅ Done, tested, 60 orders migrated |
| **2.2 Live order board** | ✅ Done |
| **2.3 Notifications** | ✅ Push + status alerts done; SMS driver written but needs a provider |
| **2.4 Menu availability** | ✅ Done, tested |
| **2.5 Customer management** | ✅ Done |
| **3.1 Payment method & status** | ✅ Done, tested |
| **3.2 Real coupons** | ✅ Done, tested |
| **3.3 Business analytics** | ✅ Done, tested |
| **4 Ratings and feedback** | ✅ Done, tested |
| **4 Favourites** | ✅ Done, tested |
| **4 Promotions / featured items** | ✅ Done, tested |
| **4 Loyalty** | ✅ Done, tested — ships **disabled** until you set the rates |
| **4 Scheduled orders** | ✅ Done, tested — ships **disabled** |
| **4 Multi-branch** | ⚠️ **Not built — needs your decision.** It reshapes the data model (branch-scoped menus, stock, hours, order routing) and the plan flags it as conditional on a second location actually being planned. Building speculative multi-tenancy would be the wrong call. |

**Not yet done in Phase 0:** SMS provider (0.3), request-validation layer, Sentry.

**Phase 2 needs your attention:** the status migration mapped the 56 orders
that were never marked delivered to `placed`, which is literally what they
were — but they now all appear as "New" on the order board. If they are dead
historical records, bulk-cancel them; I did not, because silently rewriting 56
real order records is your call, not mine.

**Phase 1 needs your input:** the restaurant's real coordinates and opening hours
are not known to me, so Settings ships with delivery radius enforcement **off**
and hours set to open 24/7 — deliberately permissive, so nothing that works
today stops working. Set both on the dashboard's new Settings page, then switch
radius enforcement on. Delivery fee and minimum order are both 0 until you set
them.

---

## Sequencing principle

Phases are ordered by *business risk removed per unit of work*, not by feature appeal. Phase 0 stops active bleeding. Phase 1 makes delivery actually operable. Phase 2 gives staff a real workflow. Phase 3 and beyond are growth.

Each phase is independently shippable — you can stop after any phase and have a coherent system.

---

## Phase 0 — Stop the bleeding

**Goal:** close the three critical gaps and the open admin surface. Nothing here is a feature; it is all loss prevention.

### 0.1 — Rotate the leaked credentials (E1)

The Mongo URI, `JWT_SECRET`, and ImageKit private key are in git history. Adding `.gitignore` rules does not un-leak them.

- Rotate the Atlas database password; update Render's env vars.
- Generate a new `JWT_SECRET` (invalidates all existing tokens — acceptable, and arguably desirable).
- Roll the ImageKit private key.
- Add `.env` to each `.gitignore`; commit `.env.example` files with keys and no values.
- Restrict Atlas network access to Render's egress IPs rather than `0.0.0.0/0`, if currently open.

**Do this first.** Everything else in this plan is pointless while the database password is public.

### 0.2 — Server-authoritative pricing (C1)

Rewrite `createOrder` to accept only `{ mealId, quantity }` per cart item and derive everything else server-side. The pattern already exists in `reorder` — lift it into a shared helper and use it in both places:

```js
// controller/helpers/priceCart.js  (new)
export async function priceCart(items) {
  const ids = items.map(i => i.mealId);
  const meals = await Meal.find({ _id: { $in: ids } });
  const byId = new Map(meals.map(m => [String(m._id), m]));

  let subtotal = 0;
  const priced = items.map(({ mealId, quantity }) => {
    const meal = byId.get(String(mealId));
    if (!meal) throw new HttpError(404, `Meal ${mealId} no longer available`);
    const qty = Math.max(1, Math.min(50, parseInt(quantity, 10) || 1));
    subtotal += meal.price * qty;
    return { meal: meal._id, name: meal.name, price: meal.price, quantity: qty };
  });

  return { items: priced, subtotal };
}
```

Then in `createOrder`: `subtotal` from the helper, `discountAmount` from validated coupon lookup only (never from the body), `deliveryFee` from config, and `total = max(0, subtotal - discount + deliveryFee)`.

Store `meal` as an ObjectId reference on each cart item alongside the name snapshot — this fixes reorder too, which currently re-matches meals by string name (`$or: [{"name.en"}, {"name.ar"}]`) and silently drops items when a name is edited.

**App-side change:** `handleConfirmOrder` sends `mealId` instead of `price`. The cart keeps prices locally for display only; treat any server/client mismatch as the server winning, and surface a "prices have changed" notice.

### 0.3 — Fix password reset (C3)

Stop returning the token. Two options:

- **Recommended for a phone-based product:** replace the token flow with a 6-digit OTP sent by SMS. In Jordan, a local aggregator or Twilio both work. Store a hash of the OTP, 5-minute expiry, max 3 attempts, rate-limited per phone.
- **Minimum change if SMS is deferred:** keep the token but deliver it out-of-band and return only `{ message: "If that number exists, a reset code has been sent." }` — never the token, and never a different response for unknown numbers (the current 404 confirms which phone numbers are registered).

Also raise the expiry from 60 seconds ([UserController.js:91](../controller/UserController.js#L91)) — one minute is not enough time for a human to read a code and type it.

An SMS provider added here is reused by Phase 2 notifications, so this is the natural place to introduce it.

### 0.4 — Authentication and authorization middleware (O1)

Add `middleware/auth.js` with two exports:

```js
export const requireAuth  = (req, res, next) => { /* verify Bearer, attach req.user */ };
export const requireAdmin = [requireAuth, (req, res, next) =>
  req.user.role === "admin" ? next() : res.status(403).json({ message: "Forbidden" })];
```

Apply:

| Route | Guard |
|---|---|
| `POST /register`, `/login`, `/request-reset`, `/reset-password` | public (rate-limited) |
| `GET /admin/meals`, `GET /admin/categories` | public — the app's menu depends on these |
| `POST/PATCH/DELETE` on meals and categories | `requireAdmin` |
| `GET /admin/orders` (all orders) | `requireAdmin` |
| `GET /admin/orders/user/:userId` | `requireAuth` + `req.user.id === userId \|\| admin` |
| `POST /admin/orders/add`, `/reorder` | `requireAuth`, `userId` taken **from the token**, not the body |
| `PATCH /admin/orders/update/:id`, `DELETE .../delete/:id` | `requireAdmin` |

This resolves the `// TODO get the user id from token` at [OrderController.js:37](../controller/OrderController.js#L37).

Consider renaming the public menu routes from `/admin/meals` to `/meals` (with `/admin/*` reserved for genuinely staff-only operations); the current naming is what makes the missing auth easy to overlook. Keep the old paths as aliases for one app release so existing installs keep working.

**Client changes:** attach `Authorization: Bearer` in the axios interceptor already stubbed out in [api.js](../../agha-meal/src/services/api.js); check `role === "admin"` in the dashboard's `Login.js` and `PrivateRoute.js`.

### 0.5 — Clean up the two admin accounts (E9)

Delete or fix `07789718044`; confirm a single known-good admin login. Do this after 0.1, since rotating `JWT_SECRET` logs everyone out anyway.

**Phase 0 exit criteria:** credentials rotated; an unauthenticated `curl` can read the menu and nothing else; an order's total cannot be influenced by the request body; reset tokens are never returned in a response.

---

## Phase 1 — Make delivery operable

**Goal:** a delivery order arrives with everything staff need to fulfil it without a phone call. This is the highest-ROI functional work in the plan.

### 1.1 — Capture the delivery address (C2)

**Data:** the `Order.location` GeoJSON block already exists — start using it. Add a `savedAddresses` array to `User` so returning customers pick rather than retype.

**App:** add an address step to `CheckoutModal` shown only when `orderType === "delivery"`:
- device location via `expo-location` with a map pin to confirm,
- a required free-text field for building/floor/apartment and a landmark (essential in Jordan, where street addressing is inconsistent),
- optional delivery note ("call on arrival"),
- save-for-next-time toggle.

**Validation:** reject a delivery order server-side without `location.coordinates` and an address line. Also fix the schema's `enum: ["point"]` — GeoJSON is case-sensitive and the correct value is `"Point"`.

**Dashboard:** show the address prominently on the order row and detail panel, with a tap-to-open maps link from the coordinates.

### 1.2 — Delivery zones, fees, and minimum order (O6)

Introduce a `Settings` singleton collection: `{ currency, deliveryFee, minimumOrder, deliveryRadiusKm, restaurantLocation }`.

At checkout the server computes distance from `restaurantLocation`, rejects out-of-radius addresses with a clear message, applies `deliveryFee`, and enforces `minimumOrder`. Persist `deliveryFee` and `subtotal` on the order as separate fields from `totalPrice` so the receipt reconciles.

This also fixes the fictional fee at [OrderDetailsScreen.js:100](../../agha-meal/src/screens/OrderDetailsScreen.js#L100) — delete the hardcoded `1` and the `orderType` typo, and read the stored value.

### 1.3 — Currency configuration (A5)

Replace every hardcoded `$` with a formatter reading `Settings.currency`. Default to JOD, which is 3-decimal — worth confirming whether you want prices displayed as `1.500` or `1.50`, since `toFixed(2)` is assumed throughout the current code.

### 1.4 — Business hours and open/closed (O5)

Add opening hours to `Settings`. Server rejects orders when closed; the app shows a closed banner with next opening time and disables checkout. Include a manual "pause orders" switch for when the kitchen is overwhelmed — in practice this gets used more than the schedule.

**Phase 1 exit criteria:** a delivery order cannot be placed without a usable address; the total on the customer's screen equals the total stored on the order; orders cannot be placed while closed.

---

## Phase 2 — Give staff a real workflow

**Goal:** the dashboard becomes the tool the restaurant actually runs on during service.

### 2.1 — Proper order lifecycle (O2)

Replace `isDelivered` with:

```js
status: {
  type: String,
  enum: ["placed", "accepted", "preparing", "ready", "out_for_delivery", "completed", "cancelled", "rejected"],
  default: "placed",
},
statusHistory: [{ status: String, at: Date, by: { type: ObjectId, ref: "User" } }],
cancellationReason: String,
```

Enforce legal transitions server-side (no jumping from `placed` to `completed`; no un-cancelling). Keep an `isDelivered` virtual returning `status === "completed"` for one release so the existing dashboard and app keep working during rollout, then remove it.

Add `PATCH /orders/:id/status`, and a customer-facing `POST /orders/:id/cancel` allowed only while status is `placed` or `accepted`.

The customer app needs almost no work here — [OrderHistoryScreen.js:55-82](../../agha-meal/src/screens/OrderHistoryScreen.js#L55-L82) already renders `preparing`, `on the way`, and `cancelled`. Just map the real status through instead of the boolean at line 39.

**Migration:** existing orders map `isDelivered: true → completed`, `false → placed`.

### 2.2 — Live order board

Replace the current flat order list with a service-time board: columns or filtered tabs by status, newest first, audible alert on new orders, one-tap advance to the next status, and a visible elapsed-time-since-placed on each ticket. Poll every 15–30s initially; upgrade to WebSocket/SSE if the polling load becomes noticeable.

### 2.3 — Notifications (O3)

Three flows, in priority order:

1. **Staff — new order arrives.** Highest value. Sound + browser notification on the board; optional SMS fallback if no dashboard session is active.
2. **Customer — status changed.** Push via `expo-notifications` (store the Expo push token on `User`) for accepted / preparing / out for delivery / completed / rejected.
3. **Customer — order confirmation.** SMS receipt with order ID and total, using the provider added in 0.3.

### 2.4 — Menu availability (O4)

Add `isAvailable: { type: Boolean, default: true }` to `Meal` and an `isActive` flag to `Category`. Filter unavailable meals out of the public menu; show them greyed in the dashboard with a quick toggle. Add a "sold out for today" that auto-clears at opening.

This ends the practice of deleting meals to hide them — which currently destroys the ImageKit images and breaks reorder.

Consider soft-delete (`deletedAt`) for meals generally, so historical orders always resolve to a real meal document.

### 2.5 — Customer management (A2)

A users page in the dashboard: search by phone or name, view order history and lifetime value, block a customer, correct a phone number. Staff need this the first time someone calls with a problem.

**Phase 2 exit criteria:** staff can run a full service from the board without touching the database; customers are told when their order status changes; out-of-stock items can be hidden in one click.

---

## Phase 3 — Money and margin

### 3.1 — Payment method and status (O8)

Add `paymentMethod: ["cash", "card", "online"]` and `paymentStatus: ["pending", "paid", "refunded"]`. Even cash-only, this enables shift reconciliation ("what did we take today"). Add online payment afterwards if the market wants it — cash on delivery remains dominant in Jordan, so this is a lower priority than it looks.

### 3.2 — Real coupons (O7)

A `Coupon` collection: `code`, `type` (percentage/fixed), `value`, `minOrderValue`, `maxDiscount`, `validFrom`/`validTo`, `usageLimit`, `usageCount`, `perUserLimit`, `isActive`.

`POST /coupons/validate` returns the computed discount; `createOrder` recomputes it server-side and never trusts a client-supplied `discountAmount`. Record redemptions to enforce per-user limits. Dashboard CRUD for staff.

### 3.3 — Business analytics (A1)

Replace the three count tiles with metrics that inform decisions:

- Revenue today / this week / this month, with period-over-period change
- Order count and average order value
- Pickup vs delivery split
- Top 10 and bottom 10 meals by revenue and by units
- Orders by hour of day and day of week — this is the staffing decision
- New vs returning customers; repeat rate
- Cancellation and rejection rate with reasons

All computable from existing `Order` documents via aggregation pipelines — no new data capture required, which makes this cheaper than it appears. Add a CSV export for the accountant.

---

## Phase 4 — Growth

Lower confidence on sequencing here; revisit once Phases 0–3 are live and you have real data.

- **Ratings and feedback** (A6) — per-order rating and comment; surface average rating per meal. Feeds directly into menu decisions.
- **Favourites / "order again"** — the reorder endpoint already exists; this is mostly UI.
- **Promotions and featured items** — `isFeatured` on meals, a promotions carousel on the home screen, combo/meal-deal pricing.
- **Loyalty** — points per order, redeemable as a discount. Reuses the coupon engine from 3.2.
- **Scheduled orders** — pre-order for a later time slot; needs capacity limits per slot.
- **Multi-branch** — only if the business plans a second location; it changes the data model significantly (branch-scoped menus, stock, hours, and order routing), so decide before Phase 3 if it's likely.

---

## Cross-cutting: engineering hygiene

Not a phase — fold these in alongside the work above.

| Item | Gap | When |
|---|---|---|
| Move Mongo connection out of `mealModel.js` into `config/db.js`, called from `server.js` | E2 | Phase 0, alongside the auth refactor |
| `const PORT = process.env.PORT \|\| 8080` | E3 | Phase 0 |
| Guard the self-ping with `if (process.env.NODE_ENV === "production")` | E4 | Phase 0 |
| Delete `backend/app.js` and the five unused AdminJS dependencies | E5 | Phase 0 |
| Add `"start": "node server.js"` | E6 | Phase 0 |
| Centralised error handler + a single `HttpError` type; stop leaking raw errors (`CategoryController` returns the error object to the client) | — | Phase 0 |
| Request validation layer (Zod or Joi) at the route boundary | — | Phase 1 |
| Rate limiting on `/login`, `/register`, `/request-reset` | — | Phase 0 |
| Fix `getAllMeals` returning 404 on empty | A3 | Phase 0 (one line) |
| Remove or wire the three dead functions in the app's `api.js` | A4 | Phase 2, with the status work |
| Remove committed images under `backend/controller/upload/` | E8 | Any time |
| Make `updateMeal` image replacement atomic; delete the old ImageKit file on success | E10 | Phase 2 |
| Tests: integration coverage on pricing, auth, and status transitions first — those are where a regression costs money | E7 | Start in Phase 0 with `priceCart` |
| Structured logging + error tracking (Sentry) | — | Phase 1 |
| Indexes: `Order.createdAt`, `Order.status`, `Meal.category`, `User.phone` | — | Phase 2, before analytics |

---

## Suggested order of work

```
Phase 0  ██████  Credentials, pricing, reset, auth        ← start here, blocks everything
Phase 1  ████    Address, zones/fees, currency, hours
Phase 2  ██████  Lifecycle, order board, notifications, availability, customers
Phase 3  ████    Payment status, coupons, analytics
Phase 4  ░░░░    Ratings, favourites, promotions, loyalty
```

**If you only do one thing:** Phase 0.1 and 0.2 — rotate the leaked credentials and make pricing server-authoritative. Those two close the paths by which the business can lose money or data today.

**The single biggest operational win** is Phase 1.1, capturing the delivery address. It removes a phone call from every single delivery order.
