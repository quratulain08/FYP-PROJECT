// pages/faculty.js
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import StudentDashboard from '@/app/components/Dashboard'; // Import the dashboard component
import Layout from '../components/Layout'; // Import layout component

const FacultyPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter(); // Initialize router for navigation

    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve token from local storage

        if (token) {
            setIsAuthenticated(true); // User is authenticated
        } else {
            router.push('/Login'); // Redirect to login if token is missing
        }
    }, [router]);

    // Render loading state while checking authentication
    if (!isAuthenticated) {
        return <div>Loading...</div>; // Optionally show a loading spinner or message
    }

    // Render the page content only if authenticated
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <StudentDashboard />
            </div>
        </Layout>
    );
};

export default FacultyPage;
