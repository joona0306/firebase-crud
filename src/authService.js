import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";

// 회원가입 함수
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // 회원가입 후 이메일 인증 메일 발송
    await sendEmailVerification(user);
    return user;
  } catch (error) {
    console.error("Sign Up Error:", error.message);
    throw error;
  }
};

// 로그인 함수
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // 이메일 인증 여부 확인
    if (!user.emailVerified) {
      throw new Error("Please verify your email before logging in.");
    }

    return user;
  } catch (error) {
    console.error("Sign In Error:", error.message);
    throw error;
  }
};
