// src/App.js
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import Board from "./components/Board";
import Login from "./components/Login";
import { auth } from "./firebase";
import "./style.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // Firebase 인증 상태 변화를 감지하여 로그인 상태 유지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // 이메일 인증 여부 확인
        if (currentUser.emailVerified) {
          setUser(currentUser); // 인증된 사용자만 로그인 상태 설정
        } else {
          // 이메일 인증이 완료되지 않은 경우 로그아웃 처리
          setUser(null);
          alert("로그인 전에 이메일 확인 후 인증을 완료해주세요!");
          signOut(auth); // 인증되지 않은 사용자 로그아웃
        }
      } else {
        setUser(null);
      }
      setLoading(false); // 로딩 상태 완료
    });

    // 컴포넌트가 언마운트될 때 이벤트 리스너 정리
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  if (loading) return <p>Loading...</p>; // 로딩 중 표시

  return (
    <div
      style={{
        width: "450px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1>파이어베이스를 이용한 CRUD 및 인증</h1>
      {user ? (
        <>
          <h2>환영합니다! {user.email}님</h2>
          <button onClick={handleLogout}>로그아웃</button>
        </>
      ) : (
        <Login setUser={setUser} />
      )}
      <Board user={user} />{" "}
      {/* 로그인 여부와 상관없이 Board 컴포넌트를 렌더링 */}
    </div>
  );
}

export default App;
