import {
  makeHTTPRequest,
  makeHTTPRequestWithBody,
} from "@/utils/makeHTTPRequest";
import { create } from "zustand";

const API_Category_URL = `${process.env.EXPO_PUBLIC_API_URL}/category`;

interface CategoryState {
  categories: [] | any;
  error: string;
  success: string;
  pending: boolean;
  getCategories: () => void;
  createCategory: (name: string) => void;
  deleteCategory: (categoryId: string) => void;
}

const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  error: "",
  success: "",
  pending: false,
  getCategories: async () => {
    const data = await makeHTTPRequest(`${API_Category_URL}/get`, "GET");

    if (!data?.success) {
      set({ error: data?.error, pending: false });
      return;
    }

    set((state) => ({
      categories: [...data?.data?.categories],
      pending: false,
      error: "",
      success: data?.message,
    }));
  },
  createCategory: async (name) => {
    set({ pending: true });
    const data = await makeHTTPRequestWithBody(
      `${API_Category_URL}/create`,
      "POST",
      { name }
    ).finally(() => {
      set({ pending: false });
    });

    if (!data?.success) {
      set({ error: data?.error, pending: false });
      return;
    }

    set((state) => ({
      categories: [data?.data?.category, ...state.categories],
      pending: false,
      error: "",
      success: data?.message,
    }));
  },
  deleteCategory: async (categoryId) => {
    const data = await makeHTTPRequest(
      `${API_Category_URL}/delete/${categoryId}`,
      "DELETE"
    );

    if (!data?.success) {
      set({ error: data?.error, pending: false });
      return;
    }

    set((state) => ({
      categories: state.categories.filter(
        (category: any) => category._id !== categoryId
      ),
      pending: false,
      error: "",
      success: data?.message,
    }));
  },
}));


export default useCategoryStore;