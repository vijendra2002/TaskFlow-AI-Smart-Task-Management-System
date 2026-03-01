import { useEffect, useState } from "react";
import Layout from "../components/Layout";

/* ===== AI PRIORITY ===== */
const getPriority = (description) => {
  const text = description.toLowerCase();
  if (text.includes("urgent") || text.includes("asap") || text.includes("deadline"))
    return "High";
  if (text.includes("important") || text.includes("soon"))
    return "Medium";
  return "Low";
};

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(stored);
  }, []);

  /* ===== STATUS UPDATE ===== */
  const updateStatus = (id, status) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, status } : t
    );
    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
  };

  /* ===== OPEN EDIT ===== */
  const openEdit = (task) => {
    setEditTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setAssignedTo(task.assignedTo);
    setDeadline(task.deadline || "");
  };

  /* ===== SAVE EDIT ===== */
  const saveEdit = () => {
    const updated = tasks.map((t) =>
      t.id === editTask.id
        ? { ...t, title, description, assignedTo, deadline }
        : t
    );

    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
    setEditTask(null);
  };

  /* ===== DELETE ===== */
  const confirmDelete = () => {
    const updated = tasks.filter((t) => t.id !== deleteId);
    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
    setDeleteId(null);
  };

  return (
    <Layout>
      <h2>Tasks</h2>

      {tasks.map((task) => {
        const priority = getPriority(task.description);

        return (
          <div className="task-card" key={task.id}>
            <div>
              <h4>{task.title}</h4>
              <p>{task.description}</p>

              {priority === "High" && (
                <span className="priority high">🔥 High Priority</span>
              )}
              {priority === "Medium" && (
                <span className="priority medium">⚠️ Medium Priority</span>
              )}

              {task.deadline && (
                <p className="deadline">📅 Deadline: {task.deadline}</p>
              )}
            </div>

            <div className="task-actions">
              <span className={`status ${task.status.toLowerCase()}`}>
                {task.status}
              </span>

              <select
                value={task.status}
                onChange={(e) => updateStatus(task.id, e.target.value)}
              >
                <option>Pending</option>
                <option>Completed</option>
              </select>

              <button onClick={() => openEdit(task)}>✏️</button>
              <button onClick={() => setDeleteId(task.id)}>🗑️</button>
            </div>
          </div>
        );
      })}

      {/* ===== EDIT MODAL ===== */}
      {editTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Task</h3>

            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Assign email"
            />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={saveEdit}>Save</button>
              <button className="cancel" onClick={() => setEditTask(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE MODAL ===== */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Task</h3>
            <p>Are you sure?</p>

            <div className="modal-actions">
              <button className="danger" onClick={confirmDelete}>
                Delete
              </button>
              <button className="cancel" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default TaskList;