import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export const getProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addProduct = async (productData) => {
  const docRef = await addDoc(collection(db, "products"), productData);
  return docRef.id;
};

export const updateProduct = async (id, productData) => {
  await updateDoc(doc(db, "products", id), productData);
};

export const deleteProduct = async (id) => {
  await deleteDoc(doc(db, "products", id));
};
