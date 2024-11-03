import React, { useState, useEffect } from "react";
import { addTodo, getTodos, updateTodo, deleteTodo } from "../dbService";

const Todolist = () => {
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

export default Todolist;
