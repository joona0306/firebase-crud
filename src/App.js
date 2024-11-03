// src/App.js
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import Board from "./components/Board";
import Login from "./components/Login";
import { auth } from "./firebase";
import "./style.css";

function App() {
  const [user, setUser] = useState(null);

  // Firebase 인증 상태 변화를 감지하여 로그인 상태 유지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // 로그인된 사용자 설정
      } else {
        setUser(null); // 로그아웃 시 상태 초기화
      }
    });

    // 컴포넌트가 언마운트될 때 이벤트 리스너 정리
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // 로그아웃 시 사용자 상태 초기화
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

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
          <h2>Welcome, {user.email}</h2>
          <button onClick={handleLogout}>Logout</button>
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
