import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";

const Board = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    // 실시간 업데이트 구독 설정
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setPosts(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  const addPost = async () => {
    if (newPost.trim() === "") return;
    const post = {
      content: newPost,
      author: user.email,
      createdAt: serverTimestamp(), // 서버 타임스탬프 사용
    };
    await addDoc(collection(db, "posts"), post);
    setNewPost("");
  };

  const updatePost = async (id, updatedContent) => {
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, { content: updatedContent });
  };

  const deletePost = async (id) => {
    const postRef = doc(db, "posts", id);
    await deleteDoc(postRef);
  };

  return (
    <div>
      <h2>글 목록</h2>
      {user ? (
        <div>
          <input
            type="text"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="새로운 글 작성하기"
          />
          <button onClick={addPost}>글 등록하기</button>
        </div>
      ) : (
        <p>로그인 후 글 작성 해주세요.</p>
      )}
      <ul>
        {posts.map((post, index) => (
          <li key={post.id}>
            <span>
              <strong>
                {index + 1}. {post.author}
              </strong>
              : {post.content}
              <br />
              <small>
                {post.createdAt && post.createdAt.seconds
                  ? new Date(post.createdAt.seconds * 1000).toLocaleString()
                  : "Loading..."}
              </small>
            </span>
            {user && post.author === user.email && (
              <>
                <button
                  onClick={() =>
                    updatePost(
                      post.id,
                      prompt("작성 글 수정하기", post.content)
                    )
                  }
                >
                  수정
                </button>
                <button onClick={() => deletePost(post.id)}>삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Board;
