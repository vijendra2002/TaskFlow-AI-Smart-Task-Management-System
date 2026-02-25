import { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !assignedTo) {
      alert("Title and Assigned To are required");
      return;
    }

    const newTask = {
      id: Date.now(),
      title,
      description,
      assignedTo,
      status: "Pending",
      createdBy: user.email,
    };

    const existingTasks =
      JSON.parse(localStorage.getItem("tasks")) || [];

    localStorage.setItem(
      "tasks",
      JSON.stringify([...existingTasks, newTask])
    );

    navigate("/tasks");
  };

 return (
  <Layout>
    <div className="form-page">
      <div className="form-card">
        {/* CARD HEADER */}
        <div className="form-header">
          <h2>Create Task</h2>
          <p>Create and assign a new task to employee</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-group">
            <label>Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task details"
            />
          </div>

          <div className="form-group">
            <label>Assign To (Employee Email)</label>
            <input
              type="email"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="employee@email.com"
              required
            />
          </div>

          <button type="submit" className="primary-btn full">
            Create Task
          </button>
        </form>
      </div>
    </div>
  </Layout>
);
}

export default CreateTask;