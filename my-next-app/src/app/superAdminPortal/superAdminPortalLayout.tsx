"use client"

import  Navbar from "./navbar/page"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

interface SuperAdminPortalLayoutProps {
  children: React.ReactNode
}

const SuperAdminPortalLayout: React.FC<SuperAdminPortalLayoutProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter(); // Initialize router for navigation
  // const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false); // State to track admin role
    // const role = localStorage.getItem('role'); // Retrieve role from local storage

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    const role = localStorage.getItem('role'); // Retrieve role from local storage

    if (token) {
        setIsAuthenticated(true); // User is authenticated

         if (role === 'superadmin') {
          // setIsSuperAdmin(true); // User has admin role
        } else {
          router.push('/Unauthorized'); // Redirect if user is not an admin
        }
    } else {
        router.push('/Login'); // Redirect to login if token is missing
    }
}, [router]);

if (!isAuthenticated) {
  return <div>Loading...</div>; // Optionally show a loading spinner or message
}

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-4">{children}</main>
    </div>
  )
}

export default SuperAdminPortalLayout

