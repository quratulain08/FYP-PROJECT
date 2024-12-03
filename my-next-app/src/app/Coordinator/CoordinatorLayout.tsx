import React from 'react';
import Navbar from './navbar/page'; // Adjust the import path to your navbar file

interface CoordinatorLayoutProps {
  children: React.ReactNode;
}

const CoordinatorLayout: React.FC<CoordinatorLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default CoordinatorLayout;
