import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DarkTheme, Theme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    RobotoRegular: require("../assets/fonts/Roboto-Regular.ttf"),
    RobotoLight: require("../assets/fonts/Roboto-Light.ttf"),
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-Bold.ttf"),
    Technology: require("../assets/fonts/Technology.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const theme: Theme = useMemo(
    () => ({
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        primary: "#ff0000",
        text: "#ffffff",
        background: "#1e1e1e",
      },
    }),
    [colorScheme]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider value={theme}>
          <Stack
            initialRouteName="index"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="Signin" />
            <Stack.Screen name="Signup" />
            <Stack.Screen name="Test" />
            <Stack.Screen name="TaskDetails" />
            <Stack.Screen name="VerifyAccount" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
