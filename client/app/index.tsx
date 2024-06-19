import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Index = () => {
  const { colors } = useTheme();

  useEffect(() => {
    (async () => {
      let token = await AsyncStorage.getItem("auth-token");
      if (token) {
        router.replace("/(tabs)");
      }
    })();
  });

  return (
    <View>
      <ImageBackground
        source={require("@/assets/images/background.jpg")}
        style={styles.backgroundImg}
        resizeMode="cover"
      />

      <View style={styles.container}>
        {/* Top Part */}
        <View style={styles.top}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="cover"
          />
          <Text style={[styles.welcomeText, { color: colors.text }]}>
            Welcome To
          </Text>
          <Text style={[styles.title, { color: colors.primary }]}>
            Task Ninja
          </Text>
          <Text style={[styles.slogan, { color: colors.text }]}>
            Conquare Your Tasks, Like a{" "}
            <Text style={{ color: colors.primary }}>Ninja</Text>
          </Text>
        </View>

        {/* SignUp, SignIn Buttons */}
        <View style={styles.btns}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.primary }]}
            activeOpacity={0.7}
            onPress={() => router.replace("/Signin")}
          >
            <Text style={styles.btnText}>Signin</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={34}
              color={colors.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.primary }]}
            activeOpacity={0.7}
            onPress={() => router.replace("/Signup")}
          >
            <Text style={styles.btnText}>Signup</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={34}
              color={colors.text}
            />
          </TouchableOpacity>
          
        </View>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  backgroundImg: {
    height: "100%",
    width: "100%",
  },
  container: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    height: "100%",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  top: {
    alignItems: "center",
    marginBottom: 68,
  },
  logo: {},
  welcomeText: {
    fontSize: 28,
    fontFamily: "Montserrat",
    fontWeight: "300",
  },
  title: {
    fontSize: 50,
    fontWeight: "800",
    fontFamily: "Montserrat",
  },
  slogan: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "RobotoRegular",
  },

  //   Buttons
  btns: {
    marginBottom: 68,
    width: "100%",
    alignItems: "center",
    gap: 21,
  },
  btn: {
    width: "78%",
    paddingVertical: 15,
    paddingHorizontal: 14,
    marginVertical: 9,
    borderRadius: 12,
    flexDirection: "row",
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
