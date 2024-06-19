import { useState, useRef, useEffect } from "react";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

interface PushNotificationsState {
  notification?: Notifications.Notification;
  expoPushToken?: Notifications.ExpoPushToken;
}

export const usePushNotifications = (): PushNotificationsState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListner = useRef<Notifications.Subscription>();
  const responseListner = useRef<Notifications.Subscription>();

  async function registerForPushNotificationsAsync() {
    let token;

    if (!Device.isDevice) {
      console.log("Error. use a physical device");
      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get the push token");
    }

    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });

    if (Platform.OS == "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "red",
      });
    }

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    notificationListner.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    responseListner.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification Response :: ", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListner.current!
      );

      Notifications.removeNotificationSubscription(responseListner.current!);
    };
  }, []);

  return { expoPushToken, notification };
};
