"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Unauthorized: React.FC = () => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null); // State to store the role

  useEffect(() => {
    const storedRole = localStorage.getItem("role"); // Retrieve role from local storage
    setRole(storedRole); // Update the role state
  }, []); 

  const handleRedirect = () => {
    if (role === "admin") {
      router.push("/admin/navbar"); // Redirect if the user is an admin
    }
    else if (role === "Faculty") { 
      router.push("/FacultySupervisor/navbar"); // Redirect if the user is a faculty
    }
    else if (role === "Coordinator") { 
      router.push("/Coordinator/navbar"); // Redirect if the user is a faculty
    }
    else if (role === "Student") { 
      router.push("/Student/navbar"); // Redirect if the user is a faculty
    }
    else if (role === "FocalPerson") { 
      router.push("/FocalPerson/navbar"); // Redirect if the user is a faculty
    }
    else {
      router.push("/login"); // Fallback redirection for non-admin users
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-gray-700 mb-6">
          You do not have permission to view this page. Please contact your administrator if you believe this is a mistake.
        </p>
        <img
          src="https://via.placeholder.com/300x200?text=Unauthorized+Access"
          alt="Access Denied Illustration"
          className="w-full mb-6 rounded-lg"
        />
        <button
          onClick={handleRedirect}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium transition duration-200"
        >
        Go to your respective Panel
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
