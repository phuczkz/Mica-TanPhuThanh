import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    throw new Error("Đăng nhập thất bại: " + error.message);
  }
};
