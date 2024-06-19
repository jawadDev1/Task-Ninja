import { View, Text } from "react-native";
import React, { useEffect } from "react";
import useUserStore from "@/stores/userStrore";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { usePushNotifications } from "@/utils/usePushNotifications";

const Test = () => {
  const { user, error } = useUserStore();
  const { expoPushToken, notification } = usePushNotifications();

  const data = JSON.stringify(notification, undefined, 2);

  const handleForm = async () => {
    // registerPushToken('1234567', 'ExponentPushToken[gBl7hZJC6xRObFr6rBd17R]')
    
  };
console.log(expoPushToken?.data ?? "")
  useEffect(() => {}, [user]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        onPress={handleForm}
        style={{ backgroundColor: "red", padding: 23 }}
      >
        <Text>Send request</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 25, color: "#fff" }}>
        Token: {expoPushToken?.data ?? ""}
      </Text>
      <Text style={{ fontSize: 25, color: "#fff" }}>{data}</Text>
    </View>
  );
};

export default Test;
