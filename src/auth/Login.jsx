import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";


function Login() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({ email, role })
    );

    role === "manager"
      ? navigate("/manager")
      : navigate("/employee");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* LEFT IMAGE SECTION */}
        <div className="auth-left">
          <img
            src="https://illustrations.popsy.co/gray/work-from-home.svg"
            alt="Login Illustration"
          />
          <h3>Smart Task Manager</h3>
          <p>Manage tasks efficiently with AI assistance</p>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="auth-right">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
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

            <button type="submit">Login</button>
          </form>

          <p className="auth-footer">
            New user? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;