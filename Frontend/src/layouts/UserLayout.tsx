import React, { useContext } from 'react';
import Header from '../components/globalComponents/Header';
import Footer from '../components/globalComponents/Footer'; 
import { AuthContext } from '../context/AuthContext';
import UserHeader from '../components/globalComponents/UserHeader';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useContext(AuthContext);

  const isLoggedIn = !!user;

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
      <UserHeader />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
