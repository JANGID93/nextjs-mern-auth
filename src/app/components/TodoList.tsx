"use client";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface Task {
    text: string;
    completed: boolean;
}

export default function TodoList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [task, setTask] = useState<string>("");

    const addTask = () => {
        if (task.trim()) {
            setTasks([...tasks, { text: task, completed: false }]);
            setTask("");
        }
    };

    const toggleComplete = (index: number) => {
        setTasks(tasks.map((t, i) => (i === index ? { ...t, completed: !t.completed } : t)));
    };

    const removeTask = (index: number) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">To-Do List</h2>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter a task"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <button className="btn btn-primary" onClick={addTask}>Add</button>
            </div>
            <ul className="list-group">
                {tasks.map((t, index) => (
                    <li key={index} className={`list-group-item d-flex justify-content-between align-items-center ${t.completed ? "list-group-item-success" : ""}`}>
                        <span style={{ textDecoration: t.completed ? "line-through" : "none" }}>{t.text}</span>
                        <div>
                            <button className="btn btn-success btn-sm me-2" onClick={() => toggleComplete(index)}>
                                {t.completed ? "Undo" : "Done"}
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => removeTask(index)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
