import React, { useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 이메일 인증 메일 발송
      await sendEmailVerification(user);
      setMessage(
        "회원가입이 완료되었습니다! 이메일을 확인하여 인증을 완료해주세요!"
      );
      setUser(null); // 이메일 인증 전에는 로그인 상태를 유지하지 않음
    } catch (error) {
      console.error("Sign Up Error:", error.message);
      setMessage(error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 이메일 인증 여부 확인
      if (!user.emailVerified) {
        throw new Error("로그인 전에 이메일 확인 후 인증을 완료해주세요!");
      }

      setUser(user); // 이메일 인증된 사용자만 로그인 상태 설정
      setMessage(""); // 인증 성공 시 메시지 초기화
    } catch (error) {
      console.error("Sign In Error:", error.message);
      setMessage(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // 이메일 인증 여부 확인 (Google 인증은 별도 인증 과정이 필요하지 않음)
      setUser(user);
      setMessage("");
    } catch (error) {
      console.error("Google Sign In Error:", error.message);
      setMessage(error.message);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>회원가입</button>
      <button onClick={handleSignIn}>로그인</button>
      <button onClick={handleGoogleSignIn}>구글 로그인</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
