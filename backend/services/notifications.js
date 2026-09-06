import { STATUS_LABELS } from "./orderStatus.js";

const EXPO_PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";

/**
 * Notification delivery.
 *
 * Two channels, both behind one interface so the call sites do not care which
 * is configured:
 *   - Expo push, for customers with the app installed (no credentials needed,
 *     Expo's endpoint accepts a token alone)
 *   - SMS, for order confirmations, via a pluggable driver
 *
 * With nothing configured this logs instead of sending, so the feature is
 * inert rather than broken on a deployment without credentials.
 */

const isExpoPushToken = (token) =>
  typeof token === "string" &&
  (token.startsWith("ExponentPushToken[") || token.startsWith("ExpoPushToken["));

/** Send one or more Expo push messages. Never throws into the request path. */
export const sendPush = async (messages) => {
  const valid = messages.filter((m) => isExpoPushToken(m.to));
  if (valid.length === 0) return { sent: 0, skipped: messages.length };

  try {
    const response = await fetch(EXPO_PUSH_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(valid),
    });

    if (!response.ok) {
      console.warn(`Expo push responded ${response.status}`);
      return { sent: 0, skipped: valid.length };
    }

    return { sent: valid.length, skipped: messages.length - valid.length };
  } catch (error) {
    // A push failure must never fail the order it is reporting on.
    console.warn("Push notification failed:", error.message);
    return { sent: 0, skipped: messages.length, error: error.message };
  }
};

/**
 * SMS driver. Set SMS_PROVIDER=twilio with the matching credentials to enable;
 * otherwise messages are logged so the flow is observable in development.
 */
export const sendSms = async (to, body) => {
  const provider = process.env.SMS_PROVIDER;

  if (provider !== "twilio") {
    console.info(`[sms:noop] to ${to}: ${body}`);
    return { sent: false, reason: "no provider configured" };
  }

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!sid || !token || !from) {
    console.warn("SMS_PROVIDER=twilio but credentials are incomplete");
    return { sent: false, reason: "incomplete credentials" };
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: to, From: from, Body: body }),
      }
    );

    if (!response.ok) {
      console.warn(`Twilio responded ${response.status}`);
      return { sent: false, reason: `http ${response.status}` };
    }
    return { sent: true };
  } catch (error) {
    console.warn("SMS send failed:", error.message);
    return { sent: false, reason: error.message };
  }
};

const shortId = (order) => String(order._id).slice(-5).toUpperCase();

/** Customer-facing copy for each status the customer should hear about. */
const STATUS_MESSAGES = {
  accepted: (order) => `Your order #${shortId(order)} has been accepted.`,
  preparing: (order) => `Your order #${shortId(order)} is being prepared.`,
  ready: (order) =>
    order.type === "pickup"
      ? `Your order #${shortId(order)} is ready for pickup.`
      : `Your order #${shortId(order)} is ready.`,
  out_for_delivery: (order) => `Your order #${shortId(order)} is on the way.`,
  completed: (order) => `Your order #${shortId(order)} is complete. Thank you!`,
  cancelled: (order) =>
    `Your order #${shortId(order)} was cancelled.${
      order.cancellationReason ? ` ${order.cancellationReason}` : ""
    }`,
  rejected: (order) =>
    `Sorry, order #${shortId(order)} could not be accepted.${
      order.cancellationReason ? ` ${order.cancellationReason}` : ""
    }`,
};

/** Tell the customer their order moved. Silent for statuses they need not see. */
export const notifyOrderStatus = async (order, user) => {
  const build = STATUS_MESSAGES[order.status];
  if (!build) return { sent: 0 };

  const body = build(order);
  const tokens = user?.pushTokens?.length ? user.pushTokens : [];

  return sendPush(
    tokens.map((to) => ({
      to,
      sound: "default",
      title: STATUS_LABELS[order.status] ?? "Order update",
      body,
      data: { orderId: String(order._id), status: order.status },
    }))
  );
};

/** Confirmation the moment an order is placed. */
export const notifyOrderPlaced = async (order, user) => {
  const body = `Order #${shortId(order)} received — total ${order.totalPrice}. We will confirm shortly.`;

  const [push] = await Promise.all([
    sendPush(
      (user?.pushTokens ?? []).map((to) => ({
        to,
        sound: "default",
        title: "Order received",
        body,
        data: { orderId: String(order._id), status: order.status },
      }))
    ),
    process.env.SMS_ORDER_CONFIRMATION === "true"
      ? sendSms(order.contact, body)
      : Promise.resolve({ sent: false, reason: "disabled" }),
  ]);

  return push;
};
