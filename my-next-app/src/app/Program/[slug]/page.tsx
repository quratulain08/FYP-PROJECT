"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Program from "@/models/Program";
import Layout from "@/app/components/Layout";
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import the icons

interface Department {
  id: string;
  name: string;
  startDate: string;
  category: string;
  hodName: string;
  honorific: string;
  cnic: string;
  email: string;
  phone: string;
  landLine?: string;
  address: string;
  province: string;
  city: string;
}

interface Program {
  _id: string;
  name: string;
  departmentId: string;
  startDate: string;
  category: string;
  durationYears: number;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  programHead: string;
  programHeadContact?: {
    email?: string;
    phone?: string;
  };
  programObjectives?: string[];
}

export default function DepartmentDetail() {
  const [department, setDepartment] = useState<Department | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]); // Change to an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);
  const params = useParams();
  const router = useRouter();
  const id = params.slug as string;

  const checkResponseType = async (response: Response) => {
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(`Expected JSON response but got ${contentType}\nResponse: ${text}`);
    }
    return response;
  };

  const fetchWithErrorHandling = async (url: string) => {
    const response = await fetch(url);
    await checkResponseType(response);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          setError({ message: "Department ID is missing" });
          return;
        }
    
        // Fetch department data
        const deptData: Department = await fetchWithErrorHandling(`/api/department/${id}`);
        console.log("Department Data:", deptData); // Debugging log
        setDepartment(deptData);
    
        // Fetch program data
        const programData: Program[] = await fetchWithErrorHandling(`/api/program/${id}`);
        console.log("Program Data:", programData); // Debugging log
    
        // Set multiple programs if available
        setPrograms(programData);
    
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        let errorMessage = 'Error fetching data';
        let errorDetails = '';
    
        if (err instanceof Error) {
          errorMessage = err.message;
          errorDetails = err.stack || '';
        }
    
        setError({
          message: errorMessage,
          details: errorDetails
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  const handleAddNewProgram = () => {
    // Navigate to a page or open a modal for adding a new program
    router.push(`/Add-program`);
  };

  const handleEdit = (programId: string) => {
    router.push(`/Edit-program/${programId}`);
  };

  const handleDelete = async (programId: string) => {
    const confirmation = window.confirm("Are you sure you want to delete this program?");
    if (confirmation) {
      try {
        const response = await fetch(`/api/program/${programId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error deleting program");
        }
        setPrograms((prevPrograms) => prevPrograms.filter((program) => program._id !== programId));
        alert("Program deleted successfully!");
      } catch (error) {
        alert("Error deleting program: " + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl w-full">
          <h2 className="text-red-700 text-xl font-semibold mb-2">Error</h2>
          <p className="text-red-600 mb-2">{error.message}</p>
          {error.details && (
            <details className="mt-2">
              <summary className="text-red-500 cursor-pointer">Technical Details</summary>
              <pre className="mt-2 p-2 bg-red-100 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                {error.details}
              </pre>
            </details>
          )}
          <button 
            onClick={handleRetry}
            className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Department not found</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <h1>{id}</h1>
        <div className="bg-white rounded-lg shadow-lg p-8 border border-green-500 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-green-600">
              {department.honorific} {department.hodName} - {department.name}
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="mb-3">
                <span className="font-bold">Category:</span> {department.category}
              </p>
              <p className="mb-3">
                <span className="font-bold">Start Date:</span> {department.startDate}
              </p>
              <p className="mb-3">
                <span className="font-bold">CNIC:</span> {department.cnic}
              </p>
              <p className="mb-3">
                <span className="font-bold">Email:</span> {department.email}
              </p>
            </div>
            <div>
              <p className="mb-3">
                <span className="font-bold">Phone:</span> {department.phone}
              </p>
              {department.landLine && (
                <p className="mb-3">
                  <span className="font-bold">Land Line:</span> {department.landLine}
                </p>
              )}
              <p className="mb-3">
                <span className="font-bold">Address:</span> {department.address}
              </p>
              <p className="mb-3">
                <span className="font-bold">Location:</span> {department.city}, {department.province}
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-green-600 mb-4">Program Details</h2>
        <button 
          onClick={handleAddNewProgram}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors mb-8"
        >
          Add New Program
        </button>
        {programs.length > 0 ? (
          programs.map((program, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8 border border-green-500 mb-8">
              <h2 className="text-xl font-semibold text-green-600 mb-4">Program {index+1}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <p><span className="font-bold">Program Name:</span> {program.name}</p>  
                <p><span className="font-bold">Start Date:</span> {program.startDate}</p>
                <p><span className="font-bold">Category:</span> {program.category}</p>
                <p><span className="font-bold">Duration:</span> {program.durationYears} years</p>
                {program.description && (
                  <p><span className="font-bold">Description:</span> {program.description}</p>
                )}
                <p><span className="font-bold">Contact Email:</span> {program.contactEmail}</p>
                {program.contactPhone && (
                  <p><span className="font-bold">Contact Phone:</span> {program.contactPhone}</p>
                )}
                <p><span className="font-bold">Program Head:</span> {program.programHead}</p>
                {program.programHeadContact && (
                  <div>
                    <p><span className="font-bold">Program Head Email:</span> {program.programHeadContact.email}</p>
                    <p><span className="font-bold">Program Head Phone:</span> {program.programHeadContact.phone}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-4">
                <button onClick={() => handleEdit(program._id)} className="text-blue-500 hover:underline">
                  <FaEdit className="inline mr-2" /> Edit
                </button>
                <button onClick={() => handleDelete(program._id)} className="text-red-500 hover:underline">
                  <FaTrash className="inline mr-2" /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No programs found.</p>
        )}
      </div>
    </Layout>
  );
}
