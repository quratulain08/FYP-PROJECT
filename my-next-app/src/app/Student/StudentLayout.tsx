import React from 'react';
import Navbar from './navbar/page'; // Adjust the import path to your navbar file

interface StudentLayoutProps {
  children: React.ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default StudentLayout;
