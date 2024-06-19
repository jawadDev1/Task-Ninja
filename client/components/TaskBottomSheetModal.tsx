import React, { forwardRef, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { object, string } from "yup";
import { useTheme } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Formik } from "formik";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import { toastConfig } from "./toastConfig";
import { Picker } from "@react-native-picker/picker";

import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import useTasksStore from "@/stores/tasksStore";
import { err } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useCategoryStore from "@/stores/categoryStore";

export type Ref = BottomSheetModal;

// Task Form validation Schema
let sgininSchema = object({
  task: string().required().min(5).max(100),
  details: string().required().min(8).max(250),
  dueDate: string().required().min(3).max(50),
  category: string().required().min(3).max(50),
  priority: string().required().min(3).max(50),
});

// Types for handle Form
interface formValues {
  task: string;
  details: string;
  dueDate: string;
  category: string;
  priority: string;
}

const dummyCategory = ["Tasks", "Work", "Travel"];

const TaskBottomSheetModal = forwardRef<Ref>((props, ref) => {
  const { pending, createTask, success, error } = useTasksStore();
  const { categories, getCategories } = useCategoryStore();

  const { colors } = useTheme();
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

  // useStates
  const [isDatePickerVisible, setIsDatePickerVisible] =
    useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Select Category");
  const [selectedPriority, setSelectedPriority] =
    useState<string>("Select Priority");

  // Handle The form
  const handleForm = (values: formValues) => {
    createTask(values);
  };

  // Handle form errors
  const showError = (message: string) => {
    Toast.show({
      type: "error",
      text1: message,
    });
  };

  const handleDateConfirm = (date: Date) => {
    const isoString = date.toISOString();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedDate = toZonedTime(isoString, timeZone);
    return format(zonedDate, "yyyy-MM-dd HH:mm:ssXXX");
  };

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: error,
      });
    } else if (success) {
      Toast.show({
        type: "success",
        text1: error,
      });
    }
  }, [error, success]);

  useEffect(() => {
    if (categories.length == 0) {
      getCategories();
    }

    return () => {
      setSelectedCategory("Select Category")
      setSelectedPriority("Select Priority")
    }
  }, []);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose
      index={1}
      handleIndicatorStyle={{ backgroundColor: "red" }}
      backgroundStyle={{ backgroundColor: "#111111" }}
      style={styles.bottomSheet}
    >
      <Toast config={toastConfig} />
      <Text style={styles.heading}>Create Task</Text>
      {/* Add Task Form */}
      <View style={styles.container}>
        <Formik
          initialValues={{
            task: "",
            details: "",
            dueDate: "",
            category: "",
            priority: "",
          }}
          validationSchema={sgininSchema}
          onSubmit={(values) => handleForm(values)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            setFieldValue,
          }) => (
            <View style={{ width: "100%", alignItems: "center" }}>
              <View style={{ width: "100%", alignItems: "center" }}>
                <BottomSheetTextInput
                  onChangeText={handleChange("task")}
                  onBlur={handleBlur("task")}
                  value={values.task}
                  style={[styles.input, { borderColor: colors.primary }]}
                  placeholder="Enter Task"
                  placeholderTextColor={"rgba(255, 255, 255, 0.51)"}
                />
                <BottomSheetTextInput
                  onChangeText={handleChange("details")}
                  onBlur={handleBlur("details")}
                  value={values.details}
                  style={[styles.input, { borderColor: colors.primary }]}
                  placeholder="Enter Details"
                  placeholderTextColor={"rgba(255, 255, 255, 0.51)"}
                  multiline
                />

                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={(category): any => {
                    setFieldValue("category", category);
                    setSelectedCategory(category);
                  }}
                  style={[
                    styles.picker,
                    { backgroundColor: colors.background },
                  ]}
                  dropdownIconColor={colors.primary}
                  mode="dropdown"
                >
                  <Picker.Item
                      label={"Select Category"}
                      value={'Select Category'}
                      style={{
                        color: "#fff",
                        backgroundColor: colors.background,
                      }}
                      
                    />
                  {categories.map((category: any) => (
                    <Picker.Item
                      label={category.name}
                      value={category.name}
                      style={{
                        color: "#fff",
                        backgroundColor: colors.background,
                      }}
                      key={category?._id}
                    />
                  ))}
                </Picker>
                <Picker
                  selectedValue={selectedPriority}
                  onValueChange={(priority): any => {
                    setFieldValue("priority", priority);
                    setSelectedPriority(priority);
                  }}
                  style={[
                    styles.picker,
                    { backgroundColor: colors.background },
                  ]}
                  dropdownIconColor={colors.primary}
                  mode="dropdown"
                >
                  <Picker.Item
                      label={"Select Priority"}
                      value={'Select Priority'}
                      style={{
                        color: "#fff",
                        backgroundColor: colors.background,
                      }}
                      
                    />
                  {["LOW", "MEDIUM", "HIGH"].map((priority, i) => (
                    <Picker.Item
                      label={priority}
                      value={priority}
                      style={{
                        color: "#fff",
                        backgroundColor: colors.background,
                        borderWidth: 2,
                        borderColor: colors.primary,
                      }}
                      key={i}
                    />
                  ))}
                </Picker>

                {/* Date and Time Picker */}
                <TouchableOpacity
                  onPress={() => setIsDatePickerVisible(true)}
                  style={styles.dateBtn}
                >
                  <Text style={styles.dateBtnText}>Pick Due Date</Text>
                  <Ionicons
                    name="alarm-outline"
                    size={28}
                    color={colors.primary}
                  />
                </TouchableOpacity>

                <DateTimePicker
                  isVisible={isDatePickerVisible}
                  mode="datetime"
                  onConfirm={(date) => {
                    let formattedDate = handleDateConfirm(date);
                    setFieldValue("dueDate", formattedDate);
                    setIsDatePickerVisible(false);
                  }}
                  onCancel={() => setIsDatePickerVisible(false)}
                  isDarkModeEnabled={true}
                  // locale="en_GB"
                  date={new Date()}
                  timeZoneName={
                    Intl.DateTimeFormat().resolvedOptions().timeZone
                  }
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  errors?.task
                    ? showError(errors.task)
                    : errors?.details
                    ? showError(errors.details)
                    : errors?.dueDate
                    ? showError(errors.dueDate)
                    : errors?.category
                    ? showError(errors.category)
                    : errors?.priority
                    ? showError(errors.priority)
                    : handleSubmit();
                }}
                style={[styles.btn, { backgroundColor: colors.primary }]}
                activeOpacity={0.8}
              >
                {pending ? (
                  <ActivityIndicator size={28} color={colors.text} />
                ) : (
                  <Text style={styles.btnText}>Create</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  bottomSheet: {
    padding: 12,
  },
  heading: {
    fontSize: 25,
    fontWeight: "500",
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    width: "80%",
    paddingVertical: 12,
    paddingHorizontal: 12,
    color: "white",
    marginVertical: 18,
  },
  btn: {
    width: "78%",
    paddingVertical: 15,
    paddingHorizontal: 14,
    marginVertical: 9,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 25,
    fontFamily: "RobotoRegular",
    fontWeight: "500",
    color: "white",
  },

  // Picker
  picker: {
    width: "80%",
    marginVertical: 12,
  },

  // Date and Time picker
  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    margin: 12,
  },
  dateBtnText: { fontSize: 18, color: "gray" },
});

export default TaskBottomSheetModal;
