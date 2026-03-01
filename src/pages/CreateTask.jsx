import { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

function CreateTask() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [deadline, setDeadline] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !assignedTo) {
      alert("Task title & assigned email required");
      return;
    }

    const newTask = {
      id: Date.now(),
      title,
      description,
      assignedTo,
      priority,
      deadline,
      status: "Pending",
      createdBy: user.email,
    };

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));

    navigate("/tasks");
  };

  return (
    <Layout>
      <div className="create-task-wrapper">
        <div className="create-task-card">
          <h3>Create New Task</h3>

          <form onSubmit={handleSubmit}>
            <label>Task Title</label>
            <input
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label>Description</label>
            <textarea
              rows="3"
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label>Assign To (Email)</label>
            <input
              type="email"
              placeholder="employee@email.com"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />

            <label>Priority & Deadline</label>
            <div className="task-row">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>

              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <button type="submit">Create Task</button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default CreateTask;