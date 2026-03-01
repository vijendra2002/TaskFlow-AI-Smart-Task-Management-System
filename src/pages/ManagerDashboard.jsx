import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function ManagerDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    overdue: 0,
  });

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const today = new Date();

    const pending = tasks.filter(t => t.status === "Pending").length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    const overdue = tasks.filter(t => {
      if (!t.deadline) return false;
      const deadline = new Date(t.deadline);
      return deadline < today && t.status !== "Completed";
    }).length;

    setStats({
      total: tasks.length,
      pending,
      completed,
      overdue,
    });
  }, []);

  const chartData = [
  { name: "Completed", value: stats.completed },
  { name: "Pending", value: stats.pending },
  { name: "Overdue", value: stats.overdue || 0 },
];

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

  const max = Math.max(
    stats.completed,
    stats.pending,
    stats.overdue,
    1
  );

  return (
    <Layout>
      <h2>Manager Dashboard</h2>

      {/* ===== Stats Cards ===== */}
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

        <div className="stat-card accent-red">
          <div className="stat-head">
            <span>⚠️</span>
            <h4>Overdue</h4>
          </div>
          <p>{stats.overdue}</p>
        </div>
      </div>

      {/* ===== Task Status Chart ===== */}
      <div className="stat-card" style={{ marginTop: "24px" }}>
        <h3>Task Status Overview</h3>
      <div style={{ width: "100%", height: 260 }}>
  <ResponsiveContainer>
    <PieChart>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={90}
        label
      >
        {chartData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "32px",
            height: "200px",
            marginTop: "20px",
          }}
        >
          <Bar
            label="Completed"
            value={stats.completed}
            max={max}
            color="#22c55e"
          />
          <Bar
            label="Pending"
            value={stats.pending}
            max={max}
            color="#facc15"
          />
          <Bar
            label="Overdue"
            value={stats.overdue}
            max={max}
            color="#ef4444"
          />
        </div>
      </div>

      {/* ===== Actions ===== */}
      <div style={{ marginTop: "24px" }}>
        <button onClick={() => navigate("/create-task")}>
          ➕ Create Task
        </button>
        <button
          style={{ marginLeft: "10px" }}
          onClick={() => navigate("/tasks")}
        >
          📋 View Tasks
        </button>
      </div>
    </Layout>
  );
}

/* ===== Small Bar Component ===== */
function Bar({ label, value, max, color }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          height: `${(value / max) * 100}%`,
          width: "60px",
          background: color,
          borderRadius: "10px",
          transition: "0.3s",
        }}
      />
      <p style={{ marginTop: "8px", fontSize: "14px" }}>{label}</p>
    </div>
  );
}

export default ManagerDashboard;