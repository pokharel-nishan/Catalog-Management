import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Book,
  Users,
  LayoutDashboard,
  ShoppingCart,
  Megaphone,
  LogOut,
  UserCheck,
} from "lucide-react";
import LogoutModal from "../../modals/LogoutModal";

type SidebarAdminProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarAdmin: React.FC<SidebarAdminProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      route: "/admin",
    },
    { label: "Manage Books", icon: <Book size={18} />, route: "/admin/books" },
    {
      label: "Manage Staffs",
      icon: <Users size={18} />,
      route: "/admin/staffs",
    },
    {
      label: "Manage Orders",
      icon: <ShoppingCart size={18} />,
      route: "/admin/orders",
    },
    {
      label: "Announcements",
      icon: <Megaphone size={18} />,
      route: "/admin/announcements",
    },
    {
      label: "Manage Users",
      icon: <UserCheck size={18} />,
      route: "/admin/users",
    },
    {
      label: "Logout",
      icon: <LogOut size={18} className="text-red-500" />,
      route: "/logout",
      isLogout: true,
    },
  ];

  const SidebarContent = ({ isMobile }: { isMobile: boolean }) => (
    <div className="mt-4 flex-grow">
      <div className="flex items-center justify-between p-2 border-b">
        {(sidebarOpen || isMobile) && (
          <h1 className="text-base font-semibold text-gray-600 pl-4">
            Admin Panel
          </h1>
        )}
        {!isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-4 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            {sidebarOpen ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        )}
      </div>
      <nav className="px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map(({ label, icon, route, isLogout }) => {
            const isActive = location.pathname === route;

            return (
              <li key={route}>
                {isLogout ? (
                  <div
                    onClick={handleLogoutClick}
                    className={`flex items-center justify-start gap-3 px-4 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                      "text-red-500 hover:bg-red-50"
                    }`}
                  >
                    {icon}
                    {(sidebarOpen || isMobile) && <span>{label}</span>}
                  </div>
                ) : (
                  <Link
                    to={route}
                    className={`flex items-center justify-start gap-3 px-4 py-2 text-sm rounded-md transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {icon}
                    {(sidebarOpen || isMobile) && <span>{label}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-20 left-2 z-20 p-2 rounded-md bg-white shadow-md"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`md:hidden fixed left-0 top-20 w-64 h-[calc(100vh-5rem)] bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <SidebarContent isMobile={true} />
      </div>

      <div
        className={`hidden md:flex h-screen bg-white shadow-lg flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
        style={{ overflow: "hidden" }}
      >
        <SidebarContent isMobile={false} />
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        closeModal={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};

export default SidebarAdmin;
