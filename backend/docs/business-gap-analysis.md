# Agha Meal — Business Gap Analysis

**Date:** 2026-09-05
**Scope:** `backend/` (Express + MongoDB API), `frontend/` (admin dashboard), `agha-meal/` (Expo customer app)
**Companion document:** [remediation-plan.md](./remediation-plan.md)

---

## 1. What the business currently is

A single-restaurant food ordering service for a Jordanian market (phone numbers validated as `077|078|079`, menu content bilingual Arabic/English).

**The three surfaces:**

| Surface | Who uses it | What it does today |
|---|---|---|
| `agha-meal/` (Expo app) | Customers | Browse categories → browse meals → add to cart → register/login → checkout as pickup or delivery → view order history → reorder |
| `frontend/` (CRA dashboard) | Staff | CRUD categories, CRUD meals, view all orders, flip an order to "delivered", delete orders, view 3 count tiles |
| `backend/` | Both | REST API on port 8080, Mongo via Atlas, images on ImageKit |

**The domain model** is three collections: `User` (name, phone, password, role, orders[]), `Meal`/`Category` (bilingual name, price, image), and `Order` (name, contact, cartItems[], totalPrice, isDelivered, type, couponCode, discountAmount, location).

**The revenue path today:** customer places an order → it appears in the dashboard list → staff presumably phone or prepare it → staff ticks "Delivered". No payment, no fulfilment tracking, no customer notification, no delivery address.

---

## 2. The core finding

The system is a **well-built catalogue and order-capture app that is missing the operational middle of the business.** Browsing, cart, and order creation are complete and polished. What is absent is everything between "customer taps Place Order" and "customer receives food": money, address, fulfilment state, and communication.

Three gaps are severe enough to be revenue-affecting or trust-affecting **today, in production**, and are treated separately in §3.

---

## 3. Critical gaps (production-affecting now)

### C1 — Order prices are set by the client, not the server

`createOrder` takes `price` from the request body and trusts it:

```js
const price = parseFloat(item.price);       // OrderController.js:48
totalPriceNumber += price * quantity;       // OrderController.js:52
```

The mobile app sends the price straight from its local cart ([CartScreen.js:134](../../agha-meal/src/screens/CartScreen.js#L134)). Nothing re-reads the `Meal` document to confirm what the item actually costs.

**Business consequence:** anyone who can send an HTTP request can order any meal for any price, including `0`. The same applies to `discountAmount` ([OrderController.js:11](../controller/OrderController.js#L11)), which is subtracted with no ceiling ([OrderController.js:69](../controller/OrderController.js#L69)) — so `totalPrice` can be driven negative. A stale app cart also silently charges yesterday's price after a menu price rise.

Note the contrast: `reorder` **does** do this correctly — it re-fetches each meal and recomputes from `meal.price`. The correct pattern already exists in the codebase; `createOrder` just doesn't use it.

### C2 — Delivery orders carry no delivery address

The checkout modal collects name, phone, and pickup/delivery only ([CheckoutModal.js](../../agha-meal/src/components/modal/CheckoutModal.js)). `handleConfirmOrder` builds `orderData` with no `location` key at all ([CartScreen.js:124-136](../../agha-meal/src/screens/CartScreen.js#L124-L136)), and the backend stores `location: location || undefined` ([OrderController.js:78](../controller/OrderController.js#L78)).

**Business consequence:** every delivery order arrives with no address. Staff must phone each customer to ask where to deliver — which is the single largest hidden operating cost in the current flow, and it scales linearly with order volume. The `Order` schema has a full GeoJSON `location` block ready and unused.

### C4 — Anyone could grant themselves an admin account

> Found during implementation, after the original analysis was written.

`register` read `role` straight from the request body and passed it to `User.create`:

```js
const { name, phone, password, role } = req.body;   // UserController.js:11
role: role || "user",                               // UserController.js:26
```

`/register` is public and unauthenticated. A single request with `{"role":"admin"}` created a full admin account — no existing credentials needed.

**Business consequence:** strictly worse than C3, which at least required knowing a registered phone number. This was self-service admin access for anyone who could reach the API. Fixed: `role` is no longer read from the body and every registration is created as `"user"`.

### C3 — Password reset returns the reset token to the caller

```js
res.status(200).json({ message: "Reset link generated", resetToken });  // UserController.js:98
```

There is no SMS or email delivery anywhere in the codebase, so the token is simply handed back over HTTP to whoever asked.

**Business consequence:** knowing a customer's phone number is sufficient to take over their account — including the two `admin` accounts. Combined with the fact that no route checks a JWT (§4, O1), the admin surface is effectively open.

---

## 4. Operational gaps

### O1 — No authorization anywhere on the API

There is no `jwt.verify` in any route or controller. `/admin/meals`, `/admin/categories`, and `/admin/orders` are fully public — anyone can add, reprice, or delete the entire menu, read every customer order (names, phone numbers, order history), or delete orders.

On the dashboard side, [Login.js:36](../../frontend/src/pages/Login.js#L36) checks only that a token came back and [PrivateRoute.js](../../frontend/src/routes/PrivateRoute.js) checks only that it hasn't expired. Neither inspects `role`, so **any of the 13 customer accounts can log into the admin dashboard** with their own password.

### O2 — Order lifecycle is a single boolean

`Order.isDelivered` is the entire fulfilment model. The business actually has at least: placed → accepted/rejected → preparing → ready → out for delivery → completed, plus cancelled.

The customer app already assumes this richer model and has the UI built for it — `getStatusColor`/`getStatusIcon` handle `preparing`, `on the way`, `cancelled` ([OrderHistoryScreen.js:55-82](../../agha-meal/src/screens/OrderHistoryScreen.js#L55-L82)) — but the mapping collapses to two states because that's all the backend offers ([OrderHistoryScreen.js:39](../../agha-meal/src/screens/OrderHistoryScreen.js#L39)). The screens are ahead of the data model.

**Consequence:** staff cannot reject an order, customers cannot cancel one, and nobody can tell a new order from one already in the kitchen.

### O3 — No notifications of any kind

No `expo-notifications`, no SMS provider, no email. The customer places an order and learns nothing further; staff learn of a new order only by refreshing the dashboard. For a restaurant, an unnoticed order is a lost order.

### O4 — No menu availability control

`Meal` has no `isAvailable`/`isActive` flag. When the kitchen runs out of an item, the only options are to delete the meal — which also deletes its ImageKit images ([MealsController.js](../controller/MealsController.js), `deleteMeal`) and breaks reorder matching — or to keep selling something that can't be served.

### O5 — No business hours or open/closed state

Nothing prevents an order at 04:00. There is no `isOpen`, no opening-hours config, no "closed" state in the app.

### O6 — Delivery fee is fictional

[OrderDetailsScreen.js:100](../../agha-meal/src/screens/OrderDetailsScreen.js#L100) computes `const deliveryFee = order.orderType === "delivery" ? 1 : 0`. Two problems: the field is `type`, not `orderType`, so this is **always 0**; and even when fixed, the fee is a hardcoded client-side constant that is never sent to or stored by the backend. There is no delivery fee, minimum order value, delivery radius, or tax anywhere in the data model.

### O7 — Coupons are a field with no system

`Order.couponCode` exists in the schema ([OrderModel.js:41](../model/OrderModel.js#L41)) but there is no `Coupon` collection, no validation, no redemption tracking. `discountAmount` is whatever the client says it is (see C1).

### O8 — No payment

No payment provider, and no `paymentMethod` or `paymentStatus` field. Cash-on-delivery is the implicit model but isn't recorded, so there's no way to mark an order paid or reconcile a shift's takings.

---

## 5. Analytics and product gaps

### A1 — The dashboard reports counts, not business

[Home.js](../../frontend/src/pages/Home/Home.js) shows three tiles: number of meals, number of categories, number of orders. Total orders ever placed is not a metric anyone runs a restaurant on.

Missing: revenue (today / week / month), average order value, pickup vs delivery split, best- and worst-selling meals, repeat-customer rate, orders by hour (for staffing). All of this is already derivable from the existing `Order` documents — this is a query-and-display gap, not a data-collection gap.

### A2 — No customer management view

The dashboard has no users page. Staff cannot look up a customer, see their order history, or deal with a problem caller.

### A3 — `getAllMeals` returns 404 when the menu is empty

[MealsController.js:10](../controller/MealsController.js#L10) treats an empty menu as an error. An empty collection is a valid state; clients see a failure and show an error screen instead of "no items yet."

### A4 — Dead API surface in the mobile client

`fetchOrderHistory`, `updateOrder`, and `cancelOrder` in [api.js](../../agha-meal/src/services/api.js) call `/orders`, `PUT /orders/:id`, and `DELETE /orders/:id` — none of which exist. The backend serves `/admin/orders`, `PATCH /admin/orders/update/:id`, `DELETE /admin/orders/delete/:id`. These three will 404 if ever wired to a button.

### A5 — Currency is displayed as `$`

Prices render as `${price}` throughout the app and dashboard, in a market using Jordanian dinar. There is no currency configuration.

### A6 — No ratings, no favourites, no promotions

No feedback loop from customers, no way to feature or promote a meal, no loyalty mechanism. These are growth features, not gaps in a working system, but they're the obvious next tier.

---

## 6. Engineering hygiene

| # | Issue | Evidence |
|---|---|---|
| E1 | `.env` files committed to git with Mongo URI, `JWT_SECRET`, ImageKit private key | `git ls-files` lists `backend/.env`, `frontend/.env`, `agha-meal/.env` |
| E2 | Mongo connection lives inside a model file, runs on import | [mealModel.js:61](../model/mealModel.js#L61) |
| E3 | `PORT` hardcoded to 8080, ignores `process.env.PORT` | [server.js:12](../server.js#L12) |
| E4 | Self-ping to the Render URL runs in every environment, including local dev | [server.js:27](../server.js#L27) |
| E5 | `backend/app.js` is an unwired AdminJS scaffold; five AdminJS deps in `package.json` are unused | [app.js](../app.js) |
| E6 | No `start` script — only `dev` (nodemon) | [package.json](../package.json) |
| E7 | Zero tests across all three projects | — |
| E8 | Uploaded source images committed under `backend/controller/upload/` | — |
| E9 | Duplicate admin account `07789718044` (11 digits) fails the dashboard's own 10-digit validation and can never log in through the UI | [Login.js:18](../../frontend/src/pages/Login.js#L18) |
| E10 | `updateMeal` uploads the new image before validating, and pushes the fileId in a separate write from the update — a failure between them orphans the ImageKit file | [MealsController.js](../controller/MealsController.js), `updateMeal` |

---

## 7. Summary

| Severity | Count | Theme |
|---|---|---|
| Critical | 4 | Client-set prices, missing delivery address, reset-token disclosure, self-service admin registration |
| Operational | 8 | No auth, single-boolean lifecycle, no notifications, no availability, no hours, no fees, no coupons, no payment |
| Analytics/product | 6 | Vanity metrics, no customer view, broken endpoints, currency |
| Hygiene | 10 | Secrets in git, config, dead code, no tests |

The proposed sequencing for closing these is in [remediation-plan.md](./remediation-plan.md).
