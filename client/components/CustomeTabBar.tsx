import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const CustomeTabBar = (props: BottomTabBarProps) => {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.tabBar}>
      <View style={[styles.container, { backgroundColor: "#111111" }]}>
        {props.state.routes.map((route: any, i) => {
          let iconName: any =
            route.name == "index"
              ? "time-outline"
              : route.name == "Category"
              ? "map-outline"
              : route.name == "Profile"
              ? "person"
              : "";
          let isActive = i === props.state.index;
          return (
            <TouchableOpacity
              style={[styles.tab, { backgroundColor: isActive ? "red" : "transparent" }]}
              key={route.name}
              onPress={() => props.navigation.navigate(route.name)}
            >
              <Ionicons name={iconName} size={27} color={"#fff"} />
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default CustomeTabBar;

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
  },
  container: {
    flex: 1,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    bottom: 12,
    width: "90%",
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 888888,
    // width: '23%',
    paddingVertical: 8,
  },
});
