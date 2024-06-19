import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart } from "react-native-gifted-charts";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import useTasksStore from "@/stores/tasksStore";
import useUserStore from "@/stores/userStrore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const Profile = () => {
  const { colors } = useTheme();
  const { pending, getTasksStatus, completedTasks, pendingTasks } =
    useTasksStore();

  const { logout } = useUserStore()

  const pieChartData = [
    { value: completedTasks, color: "red", text: completedTasks.toString() },
    { value: pendingTasks, color: "black", text: pendingTasks.toString() },
  ];

  const handleRefresh = () => {
    getTasksStatus();
  }

  const handleLogout = async () => {
    logout()
    await AsyncStorage.removeItem('auth-token')
    router.replace('/')
  }

  useEffect(() => {
    getTasksStatus();
  }, []);

  return (
    <SafeAreaView
      edges={["bottom", "top"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <TouchableOpacity onPress={handleLogout} style={styles.logout} >
        <Ionicons name="exit-outline" size={28} color={"#fff"} />
      </TouchableOpacity>
      {/* Pie Chart */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Text style={styles.heading}>Tasks Status</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Ionicons name="reload" size={25} color={"#fff"} />
        </TouchableOpacity>
      </View>
      {pending ? (
        <ActivityIndicator size={35} color={"#fff"} />
      ) : (
        <PieChart
          data={pieChartData}
          showText={true}
          textBackgroundColor="blue"
          textColor="white"
          textSize={21}
          backgroundColor={colors.background}
          labelsPosition="onBorder"
          innerRadius={83}
          showTextBackground
          textBackgroundRadius={22}
          donut
        />
      )}
      <View style={{ flexDirection: "row", gap: 29, alignItems: "center" }}>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <View
            style={[styles.chartBox, { backgroundColor: colors.primary }]}
          />
          <Text style={styles.chartText}>Completed</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <View style={[styles.chartBox, { backgroundColor: "black" }]} />
          <Text style={styles.chartText}>Pending </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  logout: {
    alignSelf: "flex-end",
  },
  heading: {
    fontSize: 24,
    color: "#fff",
    fontFamily: "MontserratBold",
    alignSelf: "flex-start",
  },
  chartBox: { width: 18, height: 18 },
  chartText: {
    fontSize: 19,
    color: "#fff",
    fontFamily: "MontserratBold",
  },
});
