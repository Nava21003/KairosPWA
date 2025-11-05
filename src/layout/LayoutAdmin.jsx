import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

const LayoutAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <NavbarAdmin sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        className="main-content-wrapper"
        style={{ flexGrow: 1, padding: "20px", overflowY: "auto" }}
      >
        <Outlet context={{ toggleSidebar }} />
      </main>
    </div>
  );
};

export default LayoutAdmin;
