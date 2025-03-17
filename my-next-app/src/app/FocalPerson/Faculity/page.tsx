"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import FocalPersonLayout from "../FocalPersonLayout"
import { Mail, Phone, Calendar, Tag, User, Plus } from "lucide-react"

// Custom notification component
const Notification = ({
  type,
  message,
  onClose,
}: {
  type: "success" | "error"
  message: string
  onClose: () => void
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center justify-between ${
        type === "success" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
      }`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-sm hover:opacity-75">
        ×
      </button>
    </div>
  )
}

interface Department {
  _id: string
  name: string
  startDate: string
  category: string
  hodName: string
  honorific: string
  cnic: string
  email: string
  phone: string
  landLine?: string
  focalPersonName: string
  focalPersonHonorific: string
  focalPersonCnic: string
  focalPersonEmail: string
  focalPersonPhone: string
}

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

const DepartmentDetail: React.FC = () => {
  const [department, setDepartment] = useState<Department | null>(null)
  const [facultyMembers, setFacultyMembers] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ message: string; details?: string } | null>(null)
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const router = useRouter()
  const id = "674179f1d751474776dc5bd5"

  const checkResponseType = async (response: Response) => {
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      throw new Error(`Expected JSON response but got ${contentType}\nResponse: ${text}`)
    }
    return response
  }

  const fetchWithErrorHandling = async (url: string) => {
    const response = await fetch(url)
    await checkResponseType(response)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      try {
        if (!id) {
          setError({ message: "Department ID is missing" })
          return
        }

        setLoading(true)

        const [deptData, facultyData] = await Promise.all([
          fetchWithErrorHandling(`/api/department/${id}`),
          fetchWithErrorHandling(`/api/faculty/department/${id}`),
        ])

        if (mounted) {
          setDepartment(deptData)
          setFacultyMembers(facultyData)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          console.error("Error:", err)
          setError({
            message: err instanceof Error ? err.message : "Error fetching data",
            details: err instanceof Error ? err.stack : "",
          })
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [id])

  const handleAddFaculty = () => {
    if (department) {
      router.push(`/admin/FacultyForm/${id}`)
    } else {
      setNotification({
        type: "error",
        message: "Department information is not available",
      })
    }
  }

  const handleAddInternship = (faculty: Faculty) => {
    if (!faculty._id) {
      setNotification({
        type: "error",
        message: "Invalid faculty ID",
      })
      return
    }

    const editUrl = `/FocalPerson/InternshipsForFaculty/${faculty._id}`
    router.push(editUrl)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    window.location.reload()
  }

  if (loading) {
    return (
      <FocalPersonLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </FocalPersonLayout>
    )
  }

  if (error) {
    return (
      <FocalPersonLayout>
        <div className="flex flex-col justify-center items-center min-h-[60vh] p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl w-full">
            <h2
              className="text-red-700 text-xl font-semibold mb-2"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Error
            </h2>
            <p className="text-red-600 mb-2" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              {error.message}
            </p>
            {error.details && (
              <details className="mt-2">
                <summary
                  className="text-red-500 cursor-pointer"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Technical Details
                </summary>
                <pre className="mt-2 p-2 bg-red-100 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                  {error.details}
                </pre>
              </details>
            )}
            <button
              onClick={handleRetry}
              className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition-colors"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Retry
            </button>
          </div>
        </div>
      </FocalPersonLayout>
    )
  }

  if (!department) {
    return (
      <FocalPersonLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-xl" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
            Department not found
          </p>
        </div>
      </FocalPersonLayout>
    )
  }

  return (
    <FocalPersonLayout>
      <div className="max-w-6xl mx-auto p-6">
        {notification && (
          <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-blue-200">
          <div className="p-6 md:p-8">

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0">
                <div className="h-32 w-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                  {getInitials(department.name)}
                </div>
              </div>

              <div className="flex-grow text-center md:text-left">
                <h1
                  className="text-3xl font-bold text-gray-800 mb-2"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {department.name}
                </h1>
                <p className="text-xl text-gray-600 mb-4" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                  Head of Department: {department.honorific} {department.hodName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Tag className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                      Category
                    </p>
                    <p
                      className="font-medium text-gray-800"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      {department.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                      Start Date
                    </p>
                    <p
                      className="font-medium text-gray-800"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      {department.startDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-5 w-5 flex items-center justify-center text-blue-500 mr-3 mt-1">
                    <span className="text-xs font-bold">ID</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                      CNIC
                    </p>
                    <p
                      className="font-medium text-gray-800"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      {department.cnic}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                      Email
                    </p>
                    <p
                      className="font-medium text-gray-800"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      {department.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                      Phone
                    </p>
                    <p
                      className="font-medium text-gray-800"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      {department.phone}
                    </p>
                  </div>
                </div>

                {department.landLine && (
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        Land Line
                      </p>
                      <p
                        className="font-medium text-gray-800"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        {department.landLine}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-blue-200">
          <div className="p-6 md:p-8">
            <h2
              className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Focal Person Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                      Name
                    </p>
                    <p
                      className="font-medium text-gray-800"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      {department.focalPersonHonorific} {department.focalPersonName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                      Email
                    </p>
                    <p
                      className="font-medium text-gray-800"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      {department.focalPersonEmail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                      Phone
                    </p>
                    <p
                      className="font-medium text-gray-800"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      {department.focalPersonPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-5 w-5 flex items-center justify-center text-blue-500 mr-3 mt-1">
                    <span className="text-xs font-bold">ID</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                      CNIC
                    </p>
                    <p
                      className="font-medium text-gray-800"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      {department.focalPersonCnic}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-200">
          <div className="p-6 md:p-8">
            <h2
              className="text-2xl font-semibold text-gray-800 mb-6"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Faculty Members
            </h2>

            {facultyMembers.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3
                  className="mt-4 text-lg font-medium text-gray-900"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  No faculty members found
                </h3>
                <p className="mt-2 text-sm text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                  Add faculty members to this department
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CNIC
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contract Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Academic Rank
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {facultyMembers.map((faculty, index) => (
                      <tr key={faculty._id || `faculty-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {faculty.name ? getInitials(faculty.name) : "??"}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div
                                className="text-sm font-medium text-gray-900"
                                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                              >
                                {faculty.honorific} {faculty.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className="text-sm text-gray-900"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            {faculty.cnic}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-100 text-blue-800"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            {faculty.contractType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className="text-sm text-gray-900"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            {faculty.academicRank}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleAddInternship(faculty)}
                            className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            Add To Internship
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </FocalPersonLayout>
  )
}

export default DepartmentDetail

