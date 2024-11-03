// src/App.js
import React, { useState } from "react";
import Login from "./components/Login";
import Todolist from "./components/Todolist";
import Board from "./components/Board";
import "./style.css";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // 로그아웃 시 사용자 상태 초기화
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <div>
      <h1>파이어베이스를 이용한 CRUD 및 인증</h1>
      <Login />
      <Todolist />

      <div style={{ padding: "20px", fontFamily: "Arial" }}>
        <h1>Simple Firebase Board</h1>
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
    </div>
  );
}

export default App;
