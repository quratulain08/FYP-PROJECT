// src/components/Layout.tsx
"use client";
import Navbar from '../admin/navbar/page'; 
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // State to track admin role

  const router = useRouter(); // Initialize router for navigation
  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    const role = localStorage.getItem('role'); // Retrieve role from local storage

    if (token) {
        setIsAuthenticated(true); // User is authenticated
            const role = localStorage.getItem('role'); // Retrieve role from local storage


        // if (role === 'admin') {
        //   setIsAdmin(true); // User has admin role
        // } else {
        //   router.push('/Unauthorized'); // Redirect if user is not an admin
        // }
    } else {
        router.push('/Login'); // Redirect to login if token is missing
    }
}, [router]);

 if (!isAuthenticated) {
        return <div>Loading...</div>; // Optionally show a loading spinner or message
    }


  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
