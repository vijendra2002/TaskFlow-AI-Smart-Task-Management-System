import { useEffect, useState } from "react";
import Layout from "../components/Layout";

/* ===== AI PRIORITY LOGIC ===== */
const getPriority = (description) => {
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

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  /* ===== AI WORKLOAD ANALYSIS ===== */
  const workload = {};

  tasks.forEach((task) => {
    const priority = getPriority(task.description);
    if (priority === "High") {
      workload[task.assignedTo] =
        (workload[task.assignedTo] || 0) + 1;
    }
  });

  return (
    <Layout>
      <h2 style={{ marginBottom: "16px" }}>AI Workload Analysis</h2>

      {Object.keys(workload).length === 0 ? (
        <p>No workload issues detected</p>
      ) : (
        Object.entries(workload).map(([email, count]) => (
          <div
            key={email}
            className="stat-card"
            style={{ marginBottom: "12px" }}
          >
            <h4>{email}</h4>
            <p>{count} High Priority Tasks</p>

            {count >= 3 && (
              <p style={{ color: "#b91c1c", fontSize: "13px" }}>
                ⚠️ AI Alert: Employee may be overloaded
              </p>
            )}
          </div>
        ))
      )}
    </Layout>
  );
}

export default Dashboard;