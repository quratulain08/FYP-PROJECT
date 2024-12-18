import React from 'react';
import Navbar from './navbar/page'; // Adjust the import path to your navbar file

interface FacultyLayoutProps {
  children: React.ReactNode;
}

const FacultyLayout: React.FC<FacultyLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default FacultyLayout;
