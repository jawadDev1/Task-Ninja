import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Text, View, useColorScheme } from "react-native";
import CustomeTabBar from "@/components/CustomeTabBar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export default function TabLayout() {
  const { colors } = useTheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <CustomeTabBar {...props} />}
        initialRouteName="index"
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="Category" />
        <Tabs.Screen name="Profile" />
      </Tabs>
    </GestureHandlerRootView>
  );
}
