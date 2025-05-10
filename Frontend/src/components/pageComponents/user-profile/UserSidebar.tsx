import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBox, FaCog, FaUser } from "react-icons/fa";

export default function AccLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const tabs = [
    { href: "/my-account", label: "My Account", icon: <FaUser /> },
    { href: "/my-orders", label: "My Orders", icon: <FaBox /> },
    { href: "/wishlists", label: "My Wishlist", icon: <FaBox /> },
    { href: "/settings", label: "Settings", icon: <FaCog /> },
  ];
  
  return (
    <section className="container mx-auto grid grid-cols-1 lg:grid-cols-6 gap-4 lg:gap-8 p-4 min-h-screen">
      <div className="col-span-1 lg:col-span-1 space-y-2 shadow rounded-2xl p-2 lg:p-4 bg-white border">
        <div className="flex flex-row lg:flex-col lg:space-y-4">
          {tabs.map(({ href, label, icon }) => {
            const isActive = location.pathname === href;
            return (
              <Link key={href} to={href}>
                <div
                  className={`flex items-center space-x-2 px-4 py-2 cursor-pointer rounded-lg text-sm ${
                    isActive ? "bg-primary text-white" : "text-primary"
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="col-span-1 lg:col-span-5 p-2 md:p-4 lg:px-6 bg-white rounded-2xl shadow border">
        {children}
      </div>
    </section>
  );
}