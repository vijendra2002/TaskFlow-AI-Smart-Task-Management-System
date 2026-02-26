import { useEffect, useState } from "react";
import Layout from "../components/Layout";

/* ===== AI PRIORITY LOGIC ===== */
const getPriority = (description = "") => {
  const text = description.toLowerCase();

  if (
    text.includes("urgent") ||
    text.includes("asap") ||
    text.includes("deadline") ||
    text.includes("immediately")
  ) {
    return "High";
  }

  if (text.includes("soon") || text.includes("important")) {
    return "Medium";
  }

  return "Low";
};

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Edit states
  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAssignedTo, setEditAssignedTo] = useState("");

  // Delete modal
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  /* ===== LOAD TASKS ===== */
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  /* ===== UPDATE STATUS ===== */
  const updateStatus = (id, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  /* ===== EDIT FLOW ===== */
  const openEditModal = (task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditAssignedTo(task.assignedTo);
  };

  const saveEditTask = () => {
    const updatedTasks = tasks.map((t) =>
      t.id === editTask.id
        ? {
            ...t,
            title: editTitle,
            description: editDescription,
            assignedTo: editAssignedTo,
          }
        : t
    );

    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setEditTask(null);
  };

  /* ===== DELETE FLOW ===== */
  const confirmDelete = () => {
    const updatedTasks = tasks.filter(
      (task) => task.id !== deleteTaskId
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setDeleteTaskId(null);
  };

  /* ===== SEARCH + FILTER + ROLE ===== */
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus = statusFilter
      ? task.status === statusFilter
      : true;

    const roleCheck =
      user.role === "manager" || task.assignedTo === user.email;

    return matchesSearch && matchesStatus && roleCheck;
  });

  /* ===== PRIORITY SORTING ===== */
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const pa = getPriority(a.description);
    const pb = getPriority(b.description);
    return priorityOrder[pa] - priorityOrder[pb];
  });

  return (
    <Layout>
      <h2 style={{ marginBottom: "16px" }}>Tasks</h2>

      {/* SEARCH + FILTER */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* TASK LIST */}
      {sortedTasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        sortedTasks.map((task) => {
          const priority = getPriority(task.description);

          return (
            <div key={task.id} className="task-row">
              <div>
                <h4>{task.title}</h4>
                <small>{task.description}</small>

                {/* 🤖 AI SUMMARY */}
                {task.summary && (
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#374151",
                      marginTop: "6px",
                    }}
                  >
                    🤖 <b>AI Summary:</b> {task.summary}
                  </p>
                )}

                {/* AI PRIORITY BADGE */}
                <div style={{ marginTop: "6px" }}>
                  <span className={`priority ${priority.toLowerCase()}`}>
                    {priority} Priority
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <span className={`status ${task.status.toLowerCase()}`}>
                  {task.status}
                </span>

                {user.role === "manager" && (
                  <>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateStatus(task.id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      className="task-btn edit"
                      onClick={() => openEditModal(task)}
                    >
                      ✏️
                    </button>

                    <button
                      className="task-btn delete"
                      onClick={() => setDeleteTaskId(task.id)}
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* EDIT MODAL */}
      {editTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Task</h3>

            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Task title"
            />

            <textarea
              rows="3"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
            />

            <input
              value={editAssignedTo}
              onChange={(e) => setEditAssignedTo(e.target.value)}
              placeholder="Assigned to email"
            />

            <div className="modal-actions">
              <button onClick={saveEditTask}>Save</button>
              <button
                className="cancel"
                onClick={() => setEditTask(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteTaskId && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Task</h3>
            <p>Are you sure you want to delete this task?</p>

            <div className="modal-actions">
              <button className="danger" onClick={confirmDelete}>
                Delete
              </button>
              <button
                className="cancel"
                onClick={() => setDeleteTaskId(null)}
              >
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