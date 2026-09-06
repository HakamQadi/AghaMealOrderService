import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { registerPushToken } from "../services/api";

/**
 * Ask for notification permission and hand the resulting Expo token to the
 * API, so the server can tell this customer when their order moves.
 *
 * Every failure path is soft: a customer who declines notifications must
 * still be able to order.
 */
export const registerForPushNotifications = async () => {
  try {
    if (!Device.isDevice) {
      // Simulators cannot receive push notifications.
      return null;
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    let status = existing;

    if (existing !== "granted") {
      const request = await Notifications.requestPermissionsAsync();
      status = request.status;
    }

    if (status !== "granted") return null;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("orders", {
        name: "Order updates",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    const { data: token } = await Notifications.getExpoPushTokenAsync();
    if (!token) return null;

    await registerPushToken(token);
    return token;
  } catch (error) {
    console.warn("Push registration skipped:", error.message);
    return null;
  }
};

/** Show notifications while the app is in the foreground too. */
export const configureNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};
