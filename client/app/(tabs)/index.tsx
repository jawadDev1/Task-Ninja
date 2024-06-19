import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
// Componentes import
import TopBar from "@/components/TopBar";
import TaskCard from "@/components/TaskCard";
import CustomeBottomSheetModal from "@/components/TaskBottomSheetModal";
// Toast import
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/toastConfig";

// Stores import
import useUserStore from "@/stores/userStrore";
import useTasksStore from "@/stores/tasksStore";

import { usePushNotifications } from "@/utils/usePushNotifications";

const index = () => {
  const { colors } = useTheme();
  // Zustand stores
  const { user, getCurrentUser } = useUserStore();
  const { getRecentTasks, pending, error, success, tasks, getLastDateTasks } =
    useTasksStore();

  const { notification } = usePushNotifications();

  // Custome Bottom sheet ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [barPosition, setBarPosition] = useState("left");
  // Bar animation shared value
  const translateBar = useSharedValue(0);

  const barStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateBar.value }],
    };
  });

  useEffect(() => {
    if (success) {
      Toast.show({
        type: "success",
        text1: success,
      });
    } else if (error) {
      Toast.show({
        type: "error",
        text1: error,
      });
    }

    return () => {
      
    }

  }, [success, error]);

  useEffect(() => {
    translateBar.value = withTiming(barPosition === "left" ? 0 : 170, {
      duration: 300,
    });

    if (!user?.email) {
      getCurrentUser();
    }

    if (barPosition == "left") {
      getRecentTasks();
    } else {
      getLastDateTasks();
    }
  }, [barPosition]);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
      <Toast config={toastConfig} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Top Bar */}
        <TopBar />

        {/* Top Tabs */}
        <View style={{ position: "relative" }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              onPress={() => setBarPosition("left")}
              activeOpacity={0.9}
              style={styles.topTabBtn}
            >
              <Text style={styles.topTabBtnText}>Recent Tasks</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setBarPosition("right")}
              activeOpacity={0.9}
              style={styles.topTabBtn}
            >
              <Text style={styles.topTabBtnText}> Today Due Date</Text>
            </TouchableOpacity>
          </View>

          <Animated.View style={[styles.bar, barStyle]} />
        </View>

        {/* Tasks List */}

        {pending ? (
          <ActivityIndicator size={35} color={"#fff"} />
        ) : tasks.length == 0 ? (
          <Text
            style={[
              styles.topTabBtnText,
              { color: "gray", alignSelf: "center", marginTop: 90 },
            ]}
          >
            No tasks to show
          </Text>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item?._id?.toString()}
            renderItem={({ item }) => {
              return <TaskCard item={item} />;
            }}
          />
        )}

        <TouchableOpacity
          style={[styles.floatingBtn, { backgroundColor: colors.primary }]}
          activeOpacity={0.9}
          onPress={() => bottomSheetModalRef.current?.present()}
        >
          <Ionicons name="add" size={32} color={"#fff"} />
        </TouchableOpacity>
      </View>
      <CustomeBottomSheetModal ref={bottomSheetModalRef} />
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    gap: 16,
  },

  floatingBtn: {
    position: "absolute",
    bottom: 28,
    right: 22,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  // Top Tabs
  bar: {
    height: 1,
    backgroundColor: "red",
    width: "44%",
    position: "absolute",
    bottom: 1,
    borderRadius: 5,
    transform: " 2s ease-in",
  },
  topTabBtn: { flex: 1, alignItems: "center", paddingVertical: 12 },
  topTabBtnText: {
    fontSize: 17,
    fontFamily: "RobotoRegular",
    fontWeight: "700",
    color: "#fff",
  },
  left: {
    transform: [{ translateX: 0 }],
  },
  right: {
    transform: [{ translateX: 150 }],
  },
});
