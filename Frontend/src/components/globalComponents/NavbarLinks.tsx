import React from 'react';
import { Link } from 'react-router-dom';

interface NavLinksProps {
  mobile?: boolean;
  setIsMobileMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavLinks: React.FC<NavLinksProps> = ({ mobile, setIsMobileMenuOpen }) => {
  const links = [
    { name: 'About', path: '/about' },
    { name: 'Books', path: '/books' },
    { name: 'Sales/Announcements', path: '/announcements' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleClick = () => {
    if (mobile && setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          className={`${
            mobile
              ? 'block px-4 py-2 hover:bg-gray-100 rounded'
              : 'text-gray-700 hover:text-blue-600 transition-colors font-medium'
          }`}
          onClick={handleClick}
        >
          {link.name}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;