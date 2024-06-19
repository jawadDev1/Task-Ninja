import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
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
import AsyncStorage from "@react-native-async-storage/async-storage";

// Signin Form validation Schema
let sgininSchema = object({
  email: string().email().required().max(50),
  password: string().required().min(6).max(50),
});

const Signin = () => {
  const { colors } = useTheme();
  const { user, error, pending, signin } = useUserStore();

  // Handle The form
  const handleForm = (values: { email: string; password: string }) => {
    signin(values.email, values.password);
  };

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: error,
      });
    } else if (user?.email && !user?.verified) {
      router.replace("/VerifyAccount");
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
          initialValues={{ email: "", password: "" }}
          validationSchema={sgininSchema}
          onSubmit={(values) => handleForm(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View style={[styles.card, { borderColor: colors.primary }]}>
              <View style={{ width: "100%", alignItems: "center" }}>
                <TextInput
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  style={[styles.input, { borderColor: colors.primary }]}
                  placeholder="Enter Email"
                  placeholderTextColor={"rgba(255, 255, 255, 0.51)"}
                  keyboardType="email-address"
                />

                <TextInput
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  style={[styles.input, { borderColor: colors.primary }]}
                  placeholder="Enter password"
                  placeholderTextColor={"rgba(255, 255, 255, 0.51)"}
                  secureTextEntry
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  errors?.email
                    ? Toast.show({
                        type: "error",
                        text1: errors.email,
                      })
                    : errors?.password
                    ? Toast.show({
                        type: "error",
                        text1: errors.password,
                      })
                    : handleSubmit();
                }}
                style={[styles.btn, { backgroundColor: colors.primary }]}
                activeOpacity={0.8}
                disabled={pending}
              >
                {pending ? (
                  <ActivityIndicator size={28} color={colors.text} />
                ) : (
                  <Text style={styles.btnText}>Signin</Text>
                )}
              </TouchableOpacity>

              <Text
                onPress={() => router.navigate("/Signup")}
                style={[styles.text, { color: colors.primary }]}
              >
                Doesn't have an account? Signup
              </Text>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default Signin;

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
  },
  text: {
    fontSize: 14,
    fontFamily: "RobotoLight",
    fontWeight: "700",
    opacity: 0.6,
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
