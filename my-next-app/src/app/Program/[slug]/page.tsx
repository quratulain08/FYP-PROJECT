"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

interface Faculty {
  id: string;
  departmentId: string;
  honorific: string;
  name: string;
  gender: string;
  cnic: string;
  address: string;
  province: string;
  city: string;
  contractType: string;
  academicRank: string;
  joiningDate: string;
  leavingDate?: string;
  isCoreComputingTeacher: boolean;
  lastAcademicQualification: {
    degreeName: string;
    degreeType: string;
    fieldOfStudy: string;
    degreeAwardingCountry: string;
    degreeAwardingInstitute: string;
    degreeStartDate: string;
    degreeEndDate: string;
  };
}

interface Program {
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
  const [facultyMembers, setFacultyMembers] = useState<Faculty[]>([]);
  const [program, setProgram] = useState<Program | null>(null);
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

        const deptData = await fetchWithErrorHandling(`/api/department/${id}`);
        setDepartment(deptData);

        const facultyData = await fetchWithErrorHandling(`/api/faculty/department/${id}`);
        setFacultyMembers(facultyData);

        const programData = await fetchWithErrorHandling(`/api/program/${id}`);
        setProgram(programData);

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

  const handleEdit = (id: string): void => {
    // Navigate to the edit page for the selected faculty member
    router.push(`/faculty/edit/${id}`);
  };

  const handleDelete = async (id: string): Promise<void> => {
    // Confirm deletion with the user
    const confirmed = confirm('Are you sure you want to delete this faculty member?');
    if (!confirmed) return;

    try {
      // Make a DELETE request to the API endpoint
      const response = await fetch(`/api/faculty/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Faculty member deleted successfully');
        // Optionally refresh the page or update state to remove the deleted member
      } else {
        const data = await response.json();
        alert(`Failed to delete faculty member: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting faculty member:', error);
      alert('An error occurred while trying to delete the faculty member.');
    }
  };

  const handleAddFaculty = () => {
    if (department) {
      // Correctly encode parameters for Next.js routing
      router.push(`/FacultyForm/${id}`);
    } else {
      setError({ message: "Department information is not available" });
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
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
    <div className="max-w-6xl mx-auto p-6">
      <h1>{id}</h1>
      <div className="bg-white rounded-lg shadow-lg p-8 border border-green-500 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-green-600">
            {department.honorific} {department.hodName} - {department.name}
          </h1>
          <button
            onClick={handleAddFaculty}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Add New Faculty
          </button>
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

      <div className="bg-white rounded-lg shadow-lg p-8 border border-green-500 mb-8">
        <h2 className="text-xl font-semibold text-green-600 mb-4">Program Details</h2>
        {program ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <p><span className="font-bold">Program Name:</span> {program.name}</p>
            <p><span className="font-bold">Start Date:</span> {program.startDate}</p>
            <p><span className="font-bold">Category:</span> {program.category}</p>
            <p><span className="font-bold">Duration:</span> {program.durationYears} years</p>
            {program.description && <p><span className="font-bold">Description:</span> {program.description}</p>}
            <p><span className="font-bold">Contact Email:</span> {program.contactEmail}</p>
            {program.contactPhone && <p><span className="font-bold">Contact Phone:</span> {program.contactPhone}</p>}
            <p><span className="font-bold">Program Head:</span> {program.programHead}</p>
            {program.programHeadContact && (
              <div>
                {program.programHeadContact.email && (
                  <p><span className="font-bold">Program Head Email:</span> {program.programHeadContact.email}</p>
                )}
                {program.programHeadContact.phone && (
                  <p><span className="font-bold">Program Head Phone:</span> {program.programHeadContact.phone}</p>
                )}
              </div>
            )}
            {program.programObjectives && program.programObjectives.length > 0 && (
              <div>
                <span className="font-bold">Objectives:</span>
                <ul className="list-disc pl-6">
                  {program.programObjectives.map((objective, idx) => (
                    <li key={idx}>{objective}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p>Program data not found.</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 border border-green-500">
        <h2 className="text-xl font-semibold text-green-600 mb-4">Faculty Members</h2>
        <div className="space-y-4">
          {facultyMembers.length === 0 ? (
            <p>No faculty members available.</p>
          ) : (
            facultyMembers.map((faculty) => (
              <div key={faculty.id} className="flex justify-between items-center">
                <p className="font-semibold">{faculty.honorific} {faculty.name}</p>
                <div>
                  <button 
                    onClick={() => handleEdit(faculty.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(faculty.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors ml-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
