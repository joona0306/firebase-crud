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
