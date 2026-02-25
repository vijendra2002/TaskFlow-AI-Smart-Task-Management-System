import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ManagerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const pending = tasks.filter(t => t.status === "Pending").length;
    const completed = tasks.filter(t => t.status === "Completed").length;

    setStats({
      total: tasks.length,
      pending,
      completed,
    });
  }, []);

  return (
    <Layout>
      <h2>Dashboard</h2>

      {/* Stats Cards */}
  <div className="stats-grid">
  <div className="stat-card accent-blue">
    <div className="stat-head">
      <span>📦</span>
      <h4>Total Tasks</h4>
    </div>
    <p>{stats.total}</p>
  </div>

  <div className="stat-card accent-yellow">
    <div className="stat-head">
      <span>⏳</span>
      <h4>Pending</h4>
    </div>
    <p>{stats.pending}</p>
  </div>

  <div className="stat-card accent-green">
    <div className="stat-head">
      <span>✅</span>
      <h4>Completed</h4>
    </div>
    <p>{stats.completed}</p>
  </div>
</div>

      {/* Actions */}
      <button onClick={() => navigate("/create-task")}>
        Create Task
      </button>
      <button style={{ marginLeft: "10px" }} onClick={() => navigate("/tasks")}>
        View Tasks
      </button>
    </Layout>
  );
}

export default ManagerDashboard;