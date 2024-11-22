"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "../../../app/components/Layout";

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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString();
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
    <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold mb-4 text-green-600">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Honorific</label>
                                <div className="w-full p-2.5 border rounded-lg text-sm bg-gray-50">
                                    {faculty.honorific || 'N/A'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <div className="w-full p-2.5 border rounded-lg text-sm bg-gray-50">
                                    {faculty.name}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <div className="w-full p-2.5 border rounded-lg text-sm bg-gray-50">
                                    {faculty.gender}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
                                <div className="w-full p-2.5 border rounded-lg text-sm bg-gray-50">
                                    {faculty.cnic}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold mb-4 text-green-600">Address Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <div className="w-full p-2.5 border rounded-lg text-sm bg-gray-50">
                                    {faculty.address}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                                <div className="w-full p-2.5 border rounded-lg text-sm bg-gray-50">
                                    {faculty.province}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <div className="w-full p-2.5 border rounded-lg text-sm bg-gray-50">
                                    {faculty.city}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Employment Details */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold mb-4 text-green-600">Employment Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
                                <div className="w-full p-2.5 border rounded-lg text-sm bg-gray-50">
                                    {faculty.contractType}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Rank</label>
                                <div className="w-full p-2.5 border rounded-lg text-sm bg-gray-50">
                                    {faculty.academicRank}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                                <div className="w-full p-2.5 border rounded-lg text-sm bg-gray-50">
                                    {formatDate(faculty.joiningDate)}
                                </div>
                            </div>

                            {faculty.leavingDate && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Leaving Date</label>
                                    <div className="w-full p-2.5 border rounded-lg text-sm bg-gray-50">
                                        {formatDate(faculty.leavingDate)}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    checked={faculty.isCoreComputingTeacher} 
                                    disabled
                                    className="mr-2"
                                />
                                <label className="text-sm font-medium text-gray-700">Core Computing Teacher</label>
                            </div>
                        </div>
                    </div>

                    {/* Last Academic Qualification */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold mb-4 text-green-600">Last Academic Qualification</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Degree Name</label>
                                <div className="w-full p-2.5 border rounded-lg text-sm bg-gray-50">
                                    {faculty.lastAcademicQualification.degreeName}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Degree Type</label>
                                <div className="w-full p-2.5 border rounded-lg text-sm bg-gray-50">
                                    {faculty.lastAcademicQualification.degreeType}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                                <div className="w-full p-2.5 border rounded-lg text-sm bg-gray-50">
                                    {faculty.lastAcademicQualification.fieldOfStudy}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Degree Awarding Country</label>
                                <div className="w-full p-2.5 border rounded-lg text-sm bg-gray-50">
                                    {faculty.lastAcademicQualification.degreeAwardingCountry}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Degree Awarding Institute</label>
                                <div className="w-full p-2.5 border rounded-lg text-sm bg-gray-50">
                                    {faculty.lastAcademicQualification.degreeAwardingInstitute}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                <div className="w-full p-2.5 border rounded-lg text-sm bg-gray-50">
                                    {formatDate(faculty.lastAcademicQualification.degreeStartDate)} - {formatDate(faculty.lastAcademicQualification.degreeEndDate)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="lg:col-span-2 flex justify-center">
                        <button 
                            onClick={() => router.back()}
                            className="w-40 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-base font-medium"
                        >
                            Back to Department
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  );
}