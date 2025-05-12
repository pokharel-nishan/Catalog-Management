import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  LogOut
} from "lucide-react";
import LogoutModal from "../../modals/LogoutModal";

export default function AccLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const tabs = [
    { href: "/profile", label: "Profile", icon: <User size={18} /> },
    { href: "/my-orders", label: "My Orders", icon: <Package size={18} /> },
    { href: "/wishlists", label: "My Wishlist", icon: <Heart size={18} /> },
    {
      href: "/logout",
      label: "Logout",
      icon: <LogOut size={18} className="text-red-500" />,
      isLogout: true,
      isDanger: true,
    },
  ];

  const handleTabClick = (tab: typeof tabs[number]) => {
    if (tab.isLogout) {
      setIsLogoutModalOpen(true);
    }
  };

  return (
    <section className="container mx-auto grid grid-cols-1 lg:grid-cols-6 gap-4 lg:gap-8 p-4 min-h-0 lg:min-h-screen">
      <div className="col-span-1 lg:col-span-1 space-y-2 shadow rounded-2xl p-2 lg:p-4 bg-white border">
        <div className="flex flex-row lg:flex-col lg:space-y-4">
          {tabs.map(({ href, label, icon, isLogout, isDanger }) => {
            const isActive = location.pathname === href;
            const tabContent = (
              <div
                className={`flex items-center space-x-2 px-4 py-2 cursor-pointer rounded-lg text-sm ${
                  isDanger
                    ? "text-red-500 hover:bg-red-50"
                    : isActive
                    ? "bg-[#2BA1AA] text-white"
                    : "text-primary"
                }`}
                onClick={() => isLogout && handleTabClick({ href, label, icon, isLogout, isDanger })}
              >
                {icon}
                <span>{label}</span>
              </div>
            );

            return isLogout ? (
              <div key={href}>{tabContent}</div>
            ) : (
              <Link key={href} to={href}>
                {tabContent}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="col-span-1 lg:col-span-5 p-2 md:p-4 lg:px-6 bg-white rounded-2xl shadow border">
        {children}
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal isOpen={isLogoutModalOpen} closeModal={() => setIsLogoutModalOpen(false)} />
    </section>
  );
}
