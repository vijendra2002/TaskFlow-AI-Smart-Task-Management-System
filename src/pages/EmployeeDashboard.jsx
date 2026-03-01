import { useEffect, useState } from "react";
import Layout from "../components/Layout";

/* ===== AI PRIORITY LOGIC ===== */
const getPriority = (description = "") => {
  const text = description.toLowerCase();

  if (
    text.includes("urgent") ||
    text.includes("asap") ||
    text.includes("deadline")
  ) {
    return "High";
  }
  if (text.includes("soon") || text.includes("important")) {
    return "Medium";
  }
  return "Low";
};

function EmployeeDashboard() {
  const [myTasks, setMyTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const assignedTasks = storedTasks.filter(
      (task) => task.assignedTo === user.email
    );
    setMyTasks(assignedTasks);
  }, [user.email]);

  /* ===== AI WORKLOAD ANALYSIS (EMPLOYEE ONLY) ===== */
  const highPriorityCount = myTasks.filter(
    (task) => getPriority(task.description) === "High"
  ).length;

  const mediumPriorityCount = myTasks.filter(
    (task) => getPriority(task.description) === "Medium"
  ).length;

  const pendingTasks = myTasks.filter(
    (task) => task.status === "Pending"
  ).length;

  return (
    <Layout>
      <h2>My Dashboard</h2>

      {/* ===== STATS CARDS ===== */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>My Tasks</h4>
          <p>{myTasks.length}</p>
        </div>

        <div className="stat-card">
          <h4>Pending</h4>
          <p>{pendingTasks}</p>
        </div>

        <div className="stat-card">
          <h4>High Priority</h4>
          <p>{highPriorityCount}</p>
        </div>
      </div>

      {/* ===== AI WORKLOAD ALERT ===== */}
      <div className="stat-card" style={{ marginTop: "20px" }}>
        <h3>AI Workload Insight</h3>

        {highPriorityCount === 0 ? (
          <p style={{ color: "#16a34a" }}>
            ✅ AI: Your workload looks balanced
          </p>
        ) : (
          <>
            <p>
              🔥 High Priority Tasks:{" "}
              <b>{highPriorityCount}</b>
            </p>

            {highPriorityCount >= 3 && (
              <p style={{ color: "#b91c1c", fontSize: "14px" }}>
                ⚠️ AI Alert: You may be overloaded. Consider
                prioritizing or requesting reassignment.
              </p>
            )}

            {mediumPriorityCount > 0 && (
              <p style={{ fontSize: "13px", color: "#6b7280" }}>
                ℹ️ {mediumPriorityCount} medium priority tasks
                detected.
              </p>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default EmployeeDashboard;