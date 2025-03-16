"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Layout from "@/app/components/Layout"
import { User, Calendar, Tag, Mail, MapPin, Briefcase, GraduationCap, FileText, ArrowLeft, Check } from "lucide-react"

interface Faculty {
  _id: string
  departmentId: string
  honorific: string
  name: string
  gender: string
  cnic: string
  address: string
  province: string
  city: string
  contractType: string
  academicRank: string
  joiningDate: string
  email: string
  leavingDate?: string
  isCoreComputingTeacher: boolean
  lastAcademicQualification: {
    degreeName: string
    degreeType: string
    fieldOfStudy: string
    degreeAwardingCountry: string
    degreeAwardingInstitute: string
    degreeStartDate: string
    degreeEndDate: string
  }
}

function formatDate(dateString: string) {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString()
}

export default function FacultyView() {
  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const params = useParams()
  const router = useRouter()
  const facultyId = params.slug as string

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await fetch(`/api/faculty/${facultyId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch faculty data")
        }
        const data = await response.json()
        setFaculty(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (facultyId) {
      fetchFacultyData()
    }
  }, [facultyId])

  // Get faculty initials (up to 2 characters)
  const getFacultyInitials = () => {
    if (!faculty) return ""

    const words = faculty.name.split(" ")
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return faculty.name.substring(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
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
    )
  }

  if (!faculty) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Faculty member not found</p>
      </div>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <button onClick={() => router.back()} className="mr-4 text-gray-600 hover:text-green-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-green-600 flex items-center">
            <User className="mr-2 h-6 w-6" />
            Faculty Details
          </h1>
        </div>

        {/* Faculty Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 mb-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-28 h-28 rounded-full bg-green-500 flex items-center justify-center mb-4">
              <span className="text-white font-bold text-3xl">{getFacultyInitials()}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">
              {faculty.honorific} {faculty.name}
            </h1>
            <p className="text-lg text-gray-600 text-center mb-2">{faculty.academicRank}</p>
            <div className="flex items-center justify-center">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {faculty.contractType}
              </span>
              {faculty.isCoreComputingTeacher && (
                <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center">
                  <Check size={14} className="mr-1" />
                  Core Computing Teacher
                </span>
              )}
            </div>
          </div>

          {/* Faculty Information Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                  <Tag className="text-green-500 w-5 h-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium text-gray-800">{faculty.gender}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="text-green-500 w-5 h-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">CNIC</p>
                    <p className="font-medium text-gray-800">{faculty.cnic}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="text-green-500 w-5 h-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{faculty.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Address Information
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-green-500 w-5 h-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-800">{faculty.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-green-500 w-5 h-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Province</p>
                    <p className="font-medium text-gray-800">{faculty.province}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-green-500 w-5 h-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium text-gray-800">{faculty.city}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Employment Details
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="text-green-500 w-5 h-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Joining Date</p>
                    <p className="font-medium text-gray-800">{formatDate(faculty.joiningDate)}</p>
                  </div>
                </div>

                {faculty.leavingDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="text-green-500 w-5 h-5 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Leaving Date</p>
                      <p className="font-medium text-gray-800">{formatDate(faculty.leavingDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Academic Qualification */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Last Academic Qualification
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                  <GraduationCap className="text-green-500 w-5 h-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Degree</p>
                    <p className="font-medium text-gray-800">
                      {faculty.lastAcademicQualification.degreeName} ({faculty.lastAcademicQualification.degreeType})
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Tag className="text-green-500 w-5 h-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Field of Study</p>
                    <p className="font-medium text-gray-800">{faculty.lastAcademicQualification.fieldOfStudy}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-green-500 w-5 h-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Awarding Institute</p>
                    <p className="font-medium text-gray-800">
                      {faculty.lastAcademicQualification.degreeAwardingInstitute},{" "}
                      {faculty.lastAcademicQualification.degreeAwardingCountry}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="text-green-500 w-5 h-5 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-800">
                      {formatDate(faculty.lastAcademicQualification.degreeStartDate)} -{" "}
                      {formatDate(faculty.lastAcademicQualification.degreeEndDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => router.back()}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition duration-300"
            >
              Back to Department
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

