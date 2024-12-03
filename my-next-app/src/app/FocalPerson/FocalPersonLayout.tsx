import React from 'react';
import Navbar from './navbar/page'; // Adjust the import path to your navbar file

interface FocalPersonLayoutProps {
  children: React.ReactNode;
}

const FocalPersonLayout: React.FC<FocalPersonLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default FocalPersonLayout;
