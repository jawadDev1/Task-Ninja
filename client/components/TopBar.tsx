import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";

const TopBar = () => {
  const { colors } = useTheme();

  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Clean up the timer on component unmount
  }, []);

  return (
    <View style={styles.topBar}>
      <View />
      <Text style={[styles.date, { color: colors.text }]}>
        {format(currentTime, "EEE, MMM y, hh:mm:ss a")}
      </Text>

      <Ionicons name="notifications" size={17} color={colors.text} />
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: "#111111",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 18,
    paddingVertical: 5,
    width: "95%",
    marginTop: 10,
    alignSelf: "center",
    borderRadius: 20,
  },
  date: {
    fontSize: 16,
    fontFamily: "Technology",
    fontWeight: "500",
    letterSpacing: 2,
  },
});
