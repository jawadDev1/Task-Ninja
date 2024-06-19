import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CategoryBottomSheetModal from "@/components/CategoryBottomSheetModal";
import useCategoryStore from "@/stores/categoryStore";

const dummyCategories = [
  {
    id: 1,
    name: "Travel",
  },
  {
    id: 2,
    name: "Food",
  },
  {
    id: 3,
    name: "Work",
  },
  {
    id: 4,
    name: "Tasks",
  },
];

const Category = () => {
  const { colors } = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { getCategories, categories, pending, deleteCategory } = useCategoryStore();

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId)
  }


  useEffect(() => {
    getCategories();
  }, []);

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={styles.heading}>Categories</Text>
      {pending ? (
        <ActivityIndicator size={34} color={"#fff"} />
      ) : categories.length == 0 ? (
        <Text style={[styles.cardText, { color: "gray", textAlign: 'center', marginTop: 90 }]}>
          No category to show
        </Text>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item?._id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>{item.name}</Text>
              <TouchableOpacity onPress={() => handleDeleteCategory(item._id)} activeOpacity={0.9}>
                <Ionicons
                  name="trash-outline"
                  size={26}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={[styles.floatingBtn, { backgroundColor: colors.primary }]}
        activeOpacity={0.9}
        onPress={() => bottomSheetModalRef.current?.present()}
      >
        <Ionicons name="add" size={32} color={"#fff"} />
      </TouchableOpacity>

      <CategoryBottomSheetModal ref={bottomSheetModalRef} />
    </SafeAreaView>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  heading: {
    fontSize: 24,
    color: "#fff",
    fontFamily: "MontserratBold",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#111111",
    paddingVertical: 17,
    borderRadius: 11,
    alignItems: "center",
    marginVertical: 12,
  },
  cardText: {
    fontSize: 24,
    color: "#fff",
    fontFamily: "RobotoRegular",
  },
  floatingBtn: {
    position: "absolute",
    bottom: 28,
    right: 22,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
});
