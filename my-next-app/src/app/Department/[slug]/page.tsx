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

export default function DepartmentDetail() {
  const [department, setDepartment] = useState<Department | null>(null);
  const [facultyMembers, setFacultyMembers] = useState<Faculty[]>([]);
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

      {/* Faculty Members Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-green-500">
        <h2 className="text-xl font-semibold text-green-600 mb-6">Faculty Members</h2>
        {facultyMembers.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No faculty members found</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {facultyMembers
                .filter((faculty) => faculty.departmentId === id) // Add this line to filter by department ID
                .map((faculty) => (
              <div key={faculty.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="font-semibold">{faculty.honorific} {faculty.name}</p>
                    <p className="text-sm text-gray-600">Academic Rank: {faculty.academicRank}</p>
                    <p className="text-sm text-gray-600">Contract: {faculty.contractType}</p>
                  </div>
                  <div>
                    <p className="text-sm">Joining Date: {faculty.joiningDate}</p>
                    {faculty.leavingDate && (
                      <p className="text-sm">Leaving Date: {faculty.leavingDate}</p>
                    )}
                    <p className="text-sm">Core Computing Teacher: {faculty.isCoreComputingTeacher ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Qualification:</p>
                    <p className="text-sm">{faculty.lastAcademicQualification.degreeName} in {faculty.lastAcademicQualification.fieldOfStudy}</p>
                    <p className="text-sm">{faculty.lastAcademicQualification.degreeAwardingInstitute}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}