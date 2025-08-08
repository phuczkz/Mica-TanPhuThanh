import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const POSTS_COLLECTION = "posts";

export const getPosts = async () => {
  const q = query(
    collection(db, POSTS_COLLECTION),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addPost = async (postData) => {
  const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
    ...postData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updatePost = async (postId, postData) => {
  const postRef = doc(db, POSTS_COLLECTION, postId);
  await updateDoc(postRef, {
    ...postData,
    updatedAt: serverTimestamp(),
  });
};

export const deletePost = async (postId) => {
  await deleteDoc(doc(db, POSTS_COLLECTION, postId));
};
