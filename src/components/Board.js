import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

const Board = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setPosts(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchPosts();
  }, []);

  const addPost = async () => {
    if (newPost.trim() === "") return;
    const post = {
      content: newPost,
      author: user.email,
      createdAt: new Date(),
    };
    const docRef = await addDoc(collection(db, "posts"), post);
    setPosts([{ id: docRef.id, ...post }, ...posts]);
    setNewPost("");
  };

  const updatePost = async (id, updatedContent) => {
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, { content: updatedContent });
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, content: updatedContent } : post
      )
    );
  };

  const deletePost = async (id) => {
    const postRef = doc(db, "posts", id);
    await deleteDoc(postRef);
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div>
      <h2>All Posts</h2>
      {user ? (
        <div>
          <input
            type="text"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Write a new post"
          />
          <button onClick={addPost}>Add Post</button>
        </div>
      ) : (
        <p>Please log in to create or manage posts.</p>
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
                {post.createdAt &&
                  new Date(post.createdAt.seconds * 1000).toLocaleString()}
              </small>
            </span>
            {user && post.author === user.email && (
              <>
                <button
                  onClick={() =>
                    updatePost(
                      post.id,
                      prompt("Update post content", post.content)
                    )
                  }
                >
                  Edit
                </button>
                <button onClick={() => deletePost(post.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Board;
