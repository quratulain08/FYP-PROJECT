// src/components/Layout.tsx
import React from 'react';
import Navbar from '../admin/navbar/page'; 


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
