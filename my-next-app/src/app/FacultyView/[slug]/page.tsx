"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Faculty {
  _id: string;
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

export default function FacultyView() {
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const params = useParams();
  const router = useRouter();
  const facultyId = params.slug as string;

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await fetch(`/api/faculty/${facultyId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch faculty data');
        }
        const data = await response.json();
        setFaculty(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (facultyId) {
      fetchFacultyData();
    }
  }, [facultyId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl w-full mx-4">
          <h2 className="text-red-700 text-xl font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Faculty member not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 border border-green-500">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-green-600">
            {faculty.honorific} {faculty.name}
          </h1>
          <button
            onClick={() => router.back()}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Back to Department
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="space-y-3">
              <p><span className="font-medium">Gender:</span> {faculty.gender}</p>
              <p><span className="font-medium">CNIC:</span> {faculty.cnic}</p>
              <p><span className="font-medium">Address:</span> {faculty.address}</p>
              <p><span className="font-medium">Location:</span> {faculty.city}, {faculty.province}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Professional Information</h2>
            <div className="space-y-3">
              <p><span className="font-medium">Academic Rank:</span> {faculty.academicRank}</p>
              <p><span className="font-medium">Contract Type:</span> {faculty.contractType}</p>
              <p><span className="font-medium">Joining Date:</span> {faculty.joiningDate}</p>
              {faculty.leavingDate && (
                <p><span className="font-medium">Leaving Date:</span> {faculty.leavingDate}</p>
              )}
              <p>
                <span className="font-medium">Core Computing Teacher:</span>{" "}
                {faculty.isCoreComputingTeacher ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Last Academic Qualification</h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <p><span className="font-medium">Degree:</span> {faculty.lastAcademicQualification.degreeName}</p>
            <p><span className="font-medium">Type:</span> {faculty.lastAcademicQualification.degreeType}</p>
            <p><span className="font-medium">Field of Study:</span> {faculty.lastAcademicQualification.fieldOfStudy}</p>
            <p><span className="font-medium">Country:</span> {faculty.lastAcademicQualification.degreeAwardingCountry}</p>
            <p><span className="font-medium">Institute:</span> {faculty.lastAcademicQualification.degreeAwardingInstitute}</p>
            <p><span className="font-medium">Duration:</span> {faculty.lastAcademicQualification.degreeStartDate} - {faculty.lastAcademicQualification.degreeEndDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}