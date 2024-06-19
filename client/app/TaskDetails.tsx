import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { formatDate } from "@/utils/formatDate";
import { Ionicons } from "@expo/vector-icons";
import useTasksStore from "@/stores/tasksStore";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/toastConfig";

interface ItemType {
  id: number;
  task: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

const Details = () => {
  const item = useLocalSearchParams();
  const { colors } = useTheme();
  const { deleteTask, success, error, toggleTaskCompleted } = useTasksStore()

  const handleDeleteTask = () => {
    deleteTask(item._id.toString())
    router.back()
  }

  const handleTaskCompleted = () => {
    toggleTaskCompleted(item._id.toString());
    router.back()
  }
 
  useEffect(() => {
    if(error) {
      Toast.show({
        type: 'error',
        text1: error
      })
    }
  }, [error])

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Toast config={toastConfig}/>
      <View style={{padding: 23,}}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={1}>
            <Ionicons name="arrow-back" size={26} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteTask}>
            <Ionicons name="trash-outline" size={26} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.subContainer}>
          <Text style={[styles.task, { color: colors.text }]}>{item.task}</Text>
          <Text style={[styles.dueDate, { color: colors.text }]}>
            {formatDate(item.dueDate.toString())}
          </Text>
          <Text style={[styles.details, { color: colors.text }]}>
            {item.details}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1 }} />
      <TouchableOpacity onPress={handleTaskCompleted} style={styles.bottomBar} >
        <Text style={[styles.bottomBarText, { color: colors.primary }]}>
          Mark as completed
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    marginVertical: 18,
    gap: 21,
  },
  task: {
    fontSize: 25,
    fontFamily: "MontserratBold",
  },
  details: {
    fontSize: 16,
    fontFamily: 'Roboto',

  },
  dueDate: {
    fontSize: 17,
    fontFamily: 'RobotoRegular'
  },
  bottomBar: {
    backgroundColor: "#111111",
    height: "10%",
    justifyContent: "flex-end",
    padding: 21
  },
  bottomBarText: {
    fontSize: 18,
    alignSelf: "flex-end",
  },
});
