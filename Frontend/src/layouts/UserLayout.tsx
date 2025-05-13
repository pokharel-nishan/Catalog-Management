import React from 'react';
import Footer from '../components/globalComponents/Footer';
import UserHeader from '../components/globalComponents/UserHeader';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UserHeader />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;