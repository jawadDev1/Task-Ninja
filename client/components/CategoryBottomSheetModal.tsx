import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { object, string } from "yup";
import { useTheme } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Formik, FormikErrors } from "formik";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import { toastConfig } from "./toastConfig";
import { Picker } from "@react-native-picker/picker";

import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import useCategoryStore from "@/stores/categoryStore";

export type Ref = BottomSheetModal;

// Category Form validation Schema
let sgininSchema = object({
  name: string().required().min(3).max(200),
});

// Types for handle Form
interface formValues {
  name: string;
}

const CategoryBottomSheetModal = forwardRef<Ref>((props, ref) => {
  const { colors } = useTheme();
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

  const { createCategory, success, error, pending } = useCategoryStore();

  // Handle The form
  const handleForm = (values: formValues) => {
    createCategory(values.name);
  };

  // Handle form errors
  const showError = (message: string) => {
    Toast.show({
      type: "error",
      text1: message,
    });
  };

  useEffect(() => {
    if (success) {
      Toast.show({
        type: "success",
        text1: success,
      });
    } else if (error) {
      Toast.show({
        type: "success",
        text1: success,
      });
    }
  }, [success, error]);

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
      <Text style={styles.heading}>Add Category</Text>
      {/* Add Category Form */}
      <View style={styles.container}>
        <Formik
          initialValues={{
            name: "",
          }}
          validationSchema={sgininSchema}
          onSubmit={(values) => handleForm(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View style={{ width: "100%", alignItems: "center" }}>
              <View style={{ width: "100%", alignItems: "center" }}>
                <BottomSheetTextInput
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  style={[styles.input, { borderColor: colors.primary }]}
                  placeholder="Enter Category name"
                  placeholderTextColor={"rgba(255, 255, 255, 0.51)"}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  errors?.name ? showError(errors.name) : handleSubmit();
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

export default CategoryBottomSheetModal;
