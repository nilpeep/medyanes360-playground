import { useState, useEffect } from "react";
import { getAPI, postAPI } from "../services/fetchApi";
import { createNewData } from "@/services/serviceOperations";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getAPI("/todos");
        setTodos(data || []);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  // todo ekleme

  const addTodo = async () => {
    if (input.trim()) {
      const newTodo = { text: input, completed: false };
      try {
        const data = await postAPI("/todos", newTodo);
        if (data) {
          setTodos((prevTodos) => [...prevTodos, data]);
          createNewData("todo", newTodo);
        }
        setInput("");
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((todo) => todo.id === id);
    const updatedTodo = { ...todo, completed: !todo.completed };
    try {
      const data = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      }).then((res) => res.json());
      setTodos(todos.map((todo) => (todo.id === id ? data : todo)));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="flex mb-4">
        <input
          type="text"
          className="border rounded w-full py-2 px-3 text-gray-700"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white rounded ml-2 px-4 py-2"
        >
          Add
        </button>
      </div>
      <ul className="list-disc pl-5">
        {todos && todos.length > 0 ? (
          todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex justify-between items-center mb-2 ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              <span
                onClick={() => toggleTodo(todo.id)}
                className="cursor-pointer"
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="bg-red-500 text-white rounded px-2 py-1 ml-4"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No todos found.</li>
        )}
      </ul>
    </div>
  );
}
