import { db } from "./firebase";
import { auth } from "./firebase"; // Thêm import auth
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

const defaultCategories = [{ id: "other", name: "Khác", isDefault: true }];

export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    let dbCategories = [];

    querySnapshot.forEach((doc) => {
      dbCategories.push({ id: doc.id, ...doc.data() });
    });

    const allCategories = [...dbCategories];
    defaultCategories.forEach((defaultCat) => {
      if (!allCategories.find((cat) => cat.id === defaultCat.id)) {
        allCategories.push(defaultCat);
      }
    });

    return allCategories;
  } catch (error) {
    console.error("Error loading categories:", error);
    return defaultCategories;
  }
};

export const addCategory = async (categoryData) => {
  try {
    console.log("Adding category - Current user:", auth.currentUser?.email);
    const docRef = await addDoc(collection(db, "categories"), categoryData);
    console.log("Category added successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    if (id === "other") {
      throw new Error("Không thể xóa danh mục mặc định");
    }

    // Log thông tin chi tiết
    console.log("=== DELETE CATEGORY DEBUG ===");
    console.log("Category ID to delete:", id);
    console.log("Current user:", auth.currentUser);
    console.log("User email:", auth.currentUser?.email);
    console.log("User UID:", auth.currentUser?.uid);
    console.log("Is authenticated:", !!auth.currentUser);

    // Thử xóa
    await deleteDoc(doc(db, "categories", id));
    console.log("✅ Category deleted successfully from Firestore");
  } catch (error) {
    console.error("❌ Error deleting category:");
    console.error("Error object:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    if (error.code === "permission-denied") {
      console.error("PERMISSION DENIED - Check Firestore rules and user email");
    }

    throw error;
  }
};
