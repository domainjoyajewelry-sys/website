import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingWidgets from '../components/FloatingWidgets';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <main className="flex-grow relative">{children}</main>
      <Footer />
      <FloatingWidgets />
    </div>
  );
};

export default Layout;
