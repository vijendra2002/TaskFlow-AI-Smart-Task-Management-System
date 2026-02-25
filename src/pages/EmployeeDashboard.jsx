import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function EmployeeDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

return (
  <Layout>
    {/* employee dashboard ka existing code */}
  </Layout>
);
}

export default EmployeeDashboard;