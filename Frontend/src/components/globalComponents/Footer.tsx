import React from "react";
import { Link } from "react-router-dom";
import { Youtube, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-12 h-12"
          />
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <Youtube
                size={20}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <Twitter
                size={20}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook
                size={20}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram
                size={20}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin
                size={20}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              />
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between text-sm text-gray-500 mt-4">
          <p>Copyright © 2025. All rights reserved.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/books" className="hover:text-blue-600 transition-colors">
              Books
            </Link>
            <Link
              to="/announcements"
              className="hover:text-blue-600 transition-colors"
            >
              Announcements
            </Link>
            <Link
              to="/help-center"
              className="hover:text-blue-600 transition-colors"
            >
              Help Center
            </Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
