import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import { Formik } from "formik";
import { router } from "expo-router";
import { object, string } from "yup";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/toastConfig";
import useUserStore from "@/stores/userStrore";

// Signin Form validation Schema
let sgininSchema = object({
  verificationCode: string().required().max(6).min(6),
});

const VerifyAccount = () => {
  const { colors } = useTheme();
  const { user, pending, verify, error } = useUserStore();

  // Handle The form
  const handleForm = (values: { verificationCode: string }) => {
    verify(values.verificationCode, user?._id);
  };

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: error,
      });
    } else if (user?.verified) {
      router.replace("/(tabs)");
    }
  }, [error, user]);

  return (
    <ScrollView contentContainerStyle={[styles.container]}>
      <ImageBackground
        source={require("@/assets/images/background1.jpg")}
        resizeMode="cover"
        style={styles.backgroundImg}
        blurRadius={3}
      />
      <Toast config={toastConfig} />
      <View style={styles.subContainer}>
        <Formik
          initialValues={{ verificationCode: "" }}
          validationSchema={sgininSchema}
          onSubmit={(values) => handleForm(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View style={[styles.card, { borderColor: colors.primary }]}>
              <Text style={[styles.verifyText, { color: colors.text }]}>
                {`Verification code is sent to ${user?.email}`}
              </Text>
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TextInput
                  onChangeText={handleChange("verificationCode")}
                  onBlur={handleBlur("verificationCode")}
                  value={values.verificationCode}
                  style={[styles.input, { borderColor: colors.primary }]}
                  placeholder="123456"
                  placeholderTextColor={"rgba(255, 255, 255, 0.51)"}
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  errors?.verificationCode
                    ? Toast.show({
                        type: "error",
                        text1: errors.verificationCode,
                      })
                    : handleSubmit();
                }}
                style={[styles.btn, { backgroundColor: colors.primary }]}
                activeOpacity={0.8}
              >
                {pending ? (
                  <ActivityIndicator size={28} color={colors.text} />
                ) : (
                  <Text style={styles.btnText}>Verify</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default VerifyAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  backgroundImg: {
    height: "100%",
    width: "100%",
  },
  verifyText: {
    fontSize: 18,
    fontFamily: "Montserrat",
    lineHeight: 26,
    position: "absolute",
    top: 12,
    left: 18,
  },
  subContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  card: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    minHeight: "60%",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    gap: 44,
    paddingVertical: 32,
  },

  input: {
    borderWidth: 1,
    width: "80%",
    paddingVertical: 12,
    paddingHorizontal: 12,
    color: "white",
    marginVertical: 18,
    letterSpacing: 18,
    textAlign: "center",
    fontSize: 21,
  },

  // Signin Button
  btn: {
    width: "78%",
    paddingVertical: 15,
    paddingHorizontal: 14,
    marginVertical: 9,
    borderRadius: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnText: {
    fontSize: 25,
    fontFamily: "RobotoRegular",
    fontWeight: "500",
    color: "white",
  },
});
