Project Console: https://console.firebase.google.com/project/fir-crud-52d2d/overview
Hosting URL: https://fir-crud-52d2d.web.app

# 1. Firebase 프로젝트 설정

- Firebase Console로 이동하여 새 프로젝트 생성
- 프로젝트 생성되면 웹 앱 추가 버튼을 클릭하여 Firebase를 React와 연결할 수 있는 설정 코드를 받는다.
- 프로젝트 설정 페이지에서 Firebase SDK 설정 및 구성 코드(구성 객체)를 복사한다.
- 이 코드를 React 프로젝트에서 Firebase를 초기화하는 데 사용할 것이다.

# 2. React 프로젝트 생성 및 Firebase 설치

```bash
npx create-react-app firebase-crud
cd firebase-crud
npm install firebase
```

# 3. Firebase 초기화

- src/firebase.js 파일을 만들고, Firebase 설정 코드를 넣어 초기화한다.
- YOUR_API_KEY 등의 값은 Firebase 콘솔에서 제공한 설정 정보로 대체

```js
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
```

# 4. Firebase 인증(Authentication)

- Firebase의 이메일/비밀번호 인증 기능을 사용하여 회원가입과 로그인 구현

```js
// src/authService.js
import {
  createUserWithEmailAndPassword,
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
    return userCredential.user;
  } catch (error) {
    console.error(error);
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
    return userCredential.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
```

# 5. Firebase Firestore와 CRUD 기능

- Firebase는 Firebase의 NoSQL 데이터베이스이다.
- 이를 이용해 CRUD 기능을 구현

```js
// src/dbService.js
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

// 컬렉션 이름을 정의합니다.
const COLLECTION_NAME = "todos";

// 데이터 추가 (Create)
export const addTodo = async (todo) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), todo);
    return docRef.id;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 데이터 읽기 (Read)
export const getTodos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 데이터 업데이트 (Update)
export const updateTodo = async (id, updatedTodo) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updatedTodo);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 데이터 삭제 (Delete)
export const deleteTodo = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
```

# 6. React 컴포넌트에서 CRUD 및 인증 기능 사용하기

- 로그인 컴포넌트

```js
// src/components/Login.js
import React, { useState } from "react";
import { signIn, signUp } from "../authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const user = await signUp(email, password);
      console.log("User signed up:", user);
    } catch (error) {
      console.error("Sign Up Error:", error);
    }
  };

  const handleSignIn = async () => {
    try {
      const user = await signIn(email, password);
      console.log("User signed in:", user);
    } catch (error) {
      console.error("Sign In Error:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
};

export default Login;
```

- Todo 리스트 컴포넌트

```js
// src/components/TodoList.js
import React, { useState, useEffect } from "react";
import { addTodo, getTodos, updateTodo, deleteTodo } from "../dbService";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      const todosData = await getTodos();
      setTodos(todosData);
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodo.trim() === "") return;
    const id = await addTodo({ title: newTodo, completed: false });
    setTodos([...todos, { id, title: newTodo, completed: false }]);
    setNewTodo("");
  };

  const handleUpdateTodo = async (id, updatedData) => {
    await updateTodo(id, updatedData);
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, ...updatedData } : todo))
    );
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo(id);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <h2>Todo List</h2>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="New Todo"
      />
      <button onClick={handleAddTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>
            <button
              onClick={() =>
                handleUpdateTodo(todo.id, { completed: !todo.completed })
              }
            >
              {todo.completed ? "Mark as Incomplete" : "Mark as Complete"}
            </button>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
```

# 7. 메인 앱 컴포넌트에서 컴포넌트 연결

```js
// src/App.js
import React from "react";
import Login from "./components/Login";
import TodoList from "./components/TodoList";

function App() {
  return (
    <div>
      <h1>파이어베이스를 이용한 CRUD 및 인증</h1>
      <Login />
      <TodoList />
    </div>
  );
}

export default App;
```
