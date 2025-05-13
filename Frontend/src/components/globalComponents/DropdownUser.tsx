import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Package, Heart } from 'lucide-react';
import LogoutModal from '../modals/LogoutModal';
import { useAuth } from '../../context/AuthContext';

export const DropdownUser: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabs = [
    { href: "/profile", label: "Profile", icon: <User size={18} /> },
    { href: "/my-orders", label: "My Orders", icon: <Package size={18} /> },
    { href: "/wishlists", label: "My Wishlist", icon: <Heart size={18} /> },
    {
      href: "#",
      label: "Logout",
      icon: <LogOut size={18} className="text-red-500" />,
      isLogout: true,
    },
  ];

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <User className="w-6 h-6 text-gray-700" />
      </button>

      <div
        className={`absolute right-0 mt-2 w-60 rounded-md bg-white shadow-md ring-1 ring-black ring-opacity-5 transition duration-200 ease-in-out z-50 ${
          dropdownOpen ? 'visible opacity-100 scale-100' : 'invisible opacity-0 scale-95'
        }`}
      >
        <div className="p-4 border-b">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>

        <div className="py-2">
          {tabs.map((tab) =>
            tab.isLogout ? (
              <button
                key={tab.label}
                onClick={() => {
                  setDropdownOpen(false);
                  setIsLogoutModalOpen(true);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                {tab.icon}
                <span className="ml-3">{tab.label}</span>
              </button>
            ) : (
              <Link
                key={tab.label}
                to={tab.href}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                {tab.icon}
                <span className="ml-3">{tab.label}</span>
              </Link>
            )
          )}
        </div>
      </div>

      <LogoutModal isOpen={isLogoutModalOpen} closeModal={() => setIsLogoutModalOpen(false)} />
    </div>
  );
};
