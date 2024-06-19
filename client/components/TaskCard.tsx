import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import { router } from "expo-router";
import { formatDate } from "@/utils/formatDate";
import useTasksStore from "@/stores/tasksStore";
interface TaskCardProps {
  item: {
    _id: string;
    task: string;
    details: string;
    dueDate: string;
    isCompleted: boolean;
  };
}

const TaskCard = ({ item }: TaskCardProps) => {
  const { colors } = useTheme();
  const { toggleTaskCompleted} = useTasksStore()

  const handlerTaskCompleted = () => {
    toggleTaskCompleted(item._id)
  }



  return (
    <View style={styles.taskCard}>
      <BouncyCheckbox
        isChecked={item.isCompleted}
        size={18}
        fillColor={colors.primary}
        unFillColor="transparent"
        iconStyle={{
          borderColor: "#fff",
          alignSelf: "flex-start",
          marginTop: 6,
        }}
        innerIconStyle={{ borderWidth: 1 }}
        onPress={(isChecked: boolean) => handlerTaskCompleted()}
      />
      <TouchableOpacity
        onPress={() =>
          router.navigate({ pathname: "/TaskDetails", params: item })
        }
        activeOpacity={0.9}
      >
        <Text style={styles.task} numberOfLines={2} selectable>
          {item.task}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.details}
        </Text>
        <Text style={styles.dueDate} selectable>
          {formatDate(item.dueDate)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskCard;

const styles = StyleSheet.create({
  taskCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 5,
    margin: 12,
    flexDirection: "row",
  },
  task: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "RobotoRegular",
    fontWeight: "600",
  },
  description: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "RobotoRegular",
    fontWeight: "600",
    marginTop: 2,
    marginBottom: 11,
  },
  dueDate: {
    color: "#fff",
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 9,
    width: "70%",
    borderRadius: 9,
  },
});
