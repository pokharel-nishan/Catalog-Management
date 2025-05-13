import React from "react";
import { Link } from "react-router-dom";

const NavbarAdmin: React.FC = () => {
  return (
    <nav className="bg-white sticky top-0 z-50 drop-shadow py-3 lg:rounded-b-[30px] px-4">
      <div className="flex justify-center items-center">
        <Link to="/admin">
          <img src="/logo.png" alt="Logo" className="h-12" />
        </Link>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
