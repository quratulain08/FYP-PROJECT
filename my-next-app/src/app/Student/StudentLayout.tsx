"use client";
import Navbar from './navbar/page'; // Adjust the import path to your navbar file
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

interface StudentLayoutProps {
  children: React.ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter(); // Initialize router for navigation
  const [isStudnet, setIsStudent] = useState<boolean>(false); // State to track admin role
    const role = localStorage.getItem('role'); // Retrieve role from local storage

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    const role = localStorage.getItem('role'); // Retrieve role from local storage

    if (token) {
        setIsAuthenticated(true); // User is authenticated

         if (role === 'Student') {
          setIsStudent(true); // User has admin role
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
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default StudentLayout;
