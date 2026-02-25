import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";
import signupImg from "../assets/Signup.svg.webp";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      alert("Please fill all fields");
      return;
    }

    // TEMP signup logic
    localStorage.setItem(
      "user",
      JSON.stringify({ name, email, role })
    );

    role === "manager"
      ? navigate("/manager")
      : navigate("/employee");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* LEFT IMAGE */}
        <div className="auth-left">
          <img
           src={signupImg}
           alt="Signup Illustration"
           style={{ width: "260px", marginBottom: "20px" }}
          />
          <h3>Join Smart Task Manager</h3>
          <p>Create your account and start managing tasks</p>
        </div>

        {/* RIGHT FORM */}
        <div className="auth-right">
          <h2>Create Account</h2>

          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>

            <button type="submit">Sign Up</button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;