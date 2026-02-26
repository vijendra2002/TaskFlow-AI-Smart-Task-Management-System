import { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

/* ===== EMPLOYEE DATA (AI USES THIS) ===== */
const employees = [
  { email: "emp1@gmail.com", skills: ["react", "frontend", "ui"] },
  { email: "emp2@gmail.com", skills: ["backend", "api", "node"] },
  { email: "emp3@gmail.com", skills: ["testing", "qa", "bug"] },
];

function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [summary, setSummary] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  /* ===== AI SMART SUGGESTION + QUALITY CHECK ===== */
  const getAISuggestion = (text) => {
    const value = text.toLowerCase();

    if (
      value.includes("urgent") ||
      value.includes("asap") ||
      value.includes("deadline") ||
      value.includes("immediately")
    ) {
      return "⚠️ AI: This task looks urgent (High Priority)";
    }

    if (value.includes("soon") || value.includes("important")) {
      return "⏳ AI: This task may require Medium Priority";
    }

    if (value.length > 0 && value.length < 20) {
      return "ℹ️ AI: Please add more details for better clarity";
    }

    return "";
  };

  /* ===== AI TASK SUMMARY (BACKEND OPENAI) ===== */
  const generateSummary = async () => {
    try {
      const res = await fetch("http://localhost:5000/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch {
      alert("AI summary failed");
    }
  };

  /* ===== AI SMART AUTO ASSIGN ===== */
  const smartAutoAssign = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const workload = {};

    employees.forEach((e) => (workload[e.email] = 0));

    tasks.forEach((task) => {
      if (
        task.description?.toLowerCase().includes("urgent") ||
        task.description?.toLowerCase().includes("asap")
      ) {
        workload[task.assignedTo] =
          (workload[task.assignedTo] || 0) + 1;
      }
    });

    let bestEmployee = null;
    let bestScore = -Infinity;

    employees.forEach((emp) => {
      let score = 0;

      // 1️⃣ Less workload
      score -= workload[emp.email] * 2;

      // 2️⃣ Skill match
      emp.skills.forEach((skill) => {
        if (description.toLowerCase().includes(skill)) {
          score += 3;
        }
      });

      // 3️⃣ Priority handling
      if (
        description.toLowerCase().includes("urgent") ||
        description.toLowerCase().includes("asap")
      ) {
        score += 2;
      }

      if (score > bestScore) {
        bestScore = score;
        bestEmployee = emp.email;
      }
    });

    setAssignedTo(bestEmployee);
  };

  /* ===== CREATE TASK ===== */
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
      summary,
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
          <div className="form-header">
            <h2>Create Task</h2>
            <p>AI-assisted task creation</p>
          </div>

          <form onSubmit={handleSubmit} className="form-body">
            <div className="form-group">
              <label>Task Title</label>
              <input
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
                onChange={(e) => {
                  const val = e.target.value;
                  setDescription(val);
                  setAiSuggestion(getAISuggestion(val));
                }}
                placeholder="Task details"
              />

              {aiSuggestion && (
                <p style={{ fontSize: "13px", color: "#92400e" }}>
                  {aiSuggestion}
                </p>
              )}
            </div>

            <button type="button" onClick={generateSummary}>
              🤖 Generate AI Summary
            </button>

            {summary && (
              <p style={{ fontSize: "13px", marginTop: "6px" }}>
                🤖 <b>AI Summary:</b> {summary}
              </p>
            )}

            <div className="form-group">
              <label>Assigned To</label>
              <input
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="employee@email.com"
                required
              />
            </div>

            <button type="button" onClick={smartAutoAssign}>
              🤖 Smart Auto Assign (AI)
            </button>

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