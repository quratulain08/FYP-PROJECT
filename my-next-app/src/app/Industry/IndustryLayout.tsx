import React from 'react';
import Navbar from './navbar/page'; // Adjust the import path to your navbar file

interface IndustryLayoutProps {
  children: React.ReactNode;
}

const IndustryLayout: React.FC<IndustryLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default IndustryLayout;
