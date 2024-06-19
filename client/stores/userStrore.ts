import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  makeHTTPRequest,
  makeHTTPRequestWithBody,
} from "@/utils/makeHTTPRequest";
import { ExpoPushToken } from "expo-notifications";

const API_USER_URL = `${process.env.EXPO_PUBLIC_API_URL}/user`;

interface UserStat {
  error: string;
  pending: boolean;
  user: {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    verified: boolean;
  };

  getCurrentUser: () => void;
  signin: (email: string, password: string) => void;
  signup: (values: {
    fullName: string;
    username: string;
    email: string;
    password: string;
    pushNotificationToken: ExpoPushToken | string;
  }) => void;
  verify: (code: string, userId: string) => void;
  logout: () => void;
}

const useUserStore = create<UserStat>((set) => ({
  error: "",
  pending: false,
  user: {
    _id: "",
    fullName: "",
    username: "",
    email: "",
    verified: false,
  },
  getCurrentUser: async () => {
    const data = await makeHTTPRequest(`${API_USER_URL}/current`, "GET");

    if (!data?.success) {
      set({ error: data?.error });
      return;
    }
    set({
      user: data.data.user,
      pending: false,
      error: "",
    });
  },
  signin: async (email, password) => {
    set({ pending: true });

    const data = await makeHTTPRequestWithBody(
      `${API_USER_URL}/signin`,
      "POST",
      { email, password }
    ).finally(() => {
      set({ pending: false });
    });

    if (!data?.success) {
      set({ error: data?.error });
      return;
    }

    if (data.data.user?.verified) {
      try {
        await AsyncStorage.setItem("auth-token", data.data.token);
      } catch (error) {
        console.log("Error in AsyncStorage setItem :: ", error);
      }
    }

    set({
      user: data.data.user,
      pending: false,
      error: "",
    });
  },
  signup: async (values) => {
    set({ pending: true });
    const data = await makeHTTPRequestWithBody(
      `${API_USER_URL}/signup`,
      "POST",
      values
    ).finally(() => {
      set({ pending: false });
    });

    if (!data?.success) {
      set({ error: data?.error });
      return;
    }

    set({
      user: data.data,
      pending: false,
      error: "",
    });
  },
  verify: async (code, userId) => {
    set({ pending: true });
    const data = await makeHTTPRequestWithBody(
      `${API_USER_URL}/verify/${userId}`,
      "POST",
      { code: code }
    ).finally(() => {
      set({ pending: false });
    });
    if (!data?.success) {
      set({ error: data?.error });
      return;
    }

    if (data.data.user?.verified) {
      try {
        await AsyncStorage.setItem("auth-token", data?.data?.token);
      } catch (error) {
        console.log("Error in AsyncStorage setItem :: ", error);
      }
    }

    set({
      user: data.data.user,
      pending: false,
      error: "",
    });
  },
  logout: async () => {
    const data = await makeHTTPRequest(`${API_USER_URL}/logout`, "GET");

    if (!data?.success) {
      set({ error: data?.error });
      return;
    }

    set((state) => ({
      user: {
        _id: "",
        fullName: "",
        username: "",
        email: "",
        verified: false,
      },
    }));
  },
}));

export default useUserStore;
