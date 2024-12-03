import React from 'react';
import Navbar from './navbar/page'; // Adjust the import path to your navbar file

interface InterpriseCellLayoutProps {
  children: React.ReactNode;
}

const InterpriseCellLayout: React.FC<InterpriseCellLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default InterpriseCellLayout;
