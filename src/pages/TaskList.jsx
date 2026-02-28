import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api"; // ✅ axios instance

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

  /* ===== LOAD TASKS (FROM BACKEND) ===== */
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  /* ===== UPDATE STATUS (BACKEND) ===== */
  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/tasks/${id}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  /* ===== EDIT FLOW ===== */
  const openEditModal = (task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditAssignedTo(task.assignedTo || "");
  };

  const saveEditTask = async () => {
    try {
      await api.put(`/tasks/${editTask._id}`, {
        title: editTitle,
        description: editDescription,
        assignedTo: editAssignedTo,
      });
      setEditTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Edit failed", error);
    }
  };

  /* ===== DELETE FLOW ===== */
  const confirmDelete = async () => {
    try {
      await api.delete(`/tasks/${deleteTaskId}`);
      setDeleteTaskId(null);
      fetchTasks();
    } catch (error) {
      console.error("Delete failed", error);
    }
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
            <div key={task._id} className="task-row">
              <div>
                <h4>{task.title}</h4>
                <small>{task.description}</small>

                {task.summary && (
                  <p style={{ fontSize: "13px", marginTop: "6px" }}>
                    🤖 <b>AI Summary:</b> {task.summary}
                  </p>
                )}

                <div style={{ marginTop: "6px" }}>
                  <span className={`priority ${priority.toLowerCase()}`}>
                    {priority} Priority
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <span className={`status ${task.status?.toLowerCase()}`}>
                  {task.status || "Pending"}
                </span>

                {user.role === "manager" && (
                  <>
                    <select
                      value={task.status || "Pending"}
                      onChange={(e) =>
                        updateStatus(task._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button onClick={() => openEditModal(task)}>✏️</button>
                    <button onClick={() => setDeleteTaskId(task._id)}>🗑️</button>
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
            />

            <textarea
              rows="3"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />

            <input
              value={editAssignedTo}
              onChange={(e) => setEditAssignedTo(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={saveEditTask}>Save</button>
              <button onClick={() => setEditTask(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteTaskId && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Task</h3>
            <p>Are you sure?</p>

            <div className="modal-actions">
              <button onClick={confirmDelete}>Delete</button>
              <button onClick={() => setDeleteTaskId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default TaskList;