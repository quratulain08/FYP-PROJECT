"use client";
import './globals.css'; // Make sure this import is correct

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use Next.js router for redirects
import Login from './Login/page'; // Login component
import Dashboard from '@/app/components/Dashboard'; // Dashboard component
import Navbar from './admin/navbar/page';
import Home from './superadmin/home/page';

const Page: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (token) {
      setIsAuthenticated(true); // User is authenticated
      
    } else {
      router.push('/superadmin/home'); // Redirect to login if token is missing
    }
  }, [router]);

  if (!isAuthenticated) {
    return null; // Show nothing while checking authentication
  }

  // Render the page content only if authenticated
  return (
    <>
<Home />

    </>
  );
};

export default Page;
