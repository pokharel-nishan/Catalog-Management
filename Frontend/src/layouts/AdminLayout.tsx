import React, { useState } from "react";
import Footer from "../components/globalComponents/Footer";
import NavbarAdmin from "../components/globalComponents/admin/AdminHeader";
import SidebarAdmin from "../components/globalComponents/admin/AdminSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // <== State here

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavbarAdmin />
      <div className="flex flex-grow">
        <SidebarAdmin sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-grow p-4">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
