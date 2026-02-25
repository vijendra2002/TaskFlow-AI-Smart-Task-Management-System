import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";
import "./layout.css";

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`app-layout ${collapsed ? "collapsed" : ""}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="main-content">
        <Navbar />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}

export default Layout;