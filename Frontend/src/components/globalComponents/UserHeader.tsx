import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import NavLinks from './NavbarLinks';
import CartDrawer from '../pageComponents/cart/CartDrawer';
import { useCart } from '../pageComponents/cart/CartContext';
import DropdownUser from './DropdownUser';
import { useAuth } from '../../context/AuthContext';

const UserHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items, setIsCartOpen } = useCart();
  const { user } = useAuth(); 

  const isLoggedIn = user !== null; 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="mr-8">
            <img src="/logo.png" alt="logo" className="w-12 h-12" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Conditionally render auth actions */}
            {isLoggedIn ? (
              <DropdownUser />
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Register
                </Link>
              </>
            )}

            {/* Cart Icon */}
            <button onClick={() => setIsCartOpen(true)} className="relative">
              <ShoppingCart
                className="text-gray-700 hover:text-blue-600 transition-colors"
                size={24}
              />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white border-t">
            <nav className="flex flex-col space-y-4">
              <NavLinks mobile setIsMobileMenuOpen={setIsMobileMenuOpen} />

              {/* Login/Register Links for Mobile */}
              {!isLoggedIn && (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="text-gray-700 text-sm px-4 py-2 hover:bg-gray-100 rounded"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-white text-sm bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>

      <CartDrawer />
    </header>
  );
};

export default UserHeader;
