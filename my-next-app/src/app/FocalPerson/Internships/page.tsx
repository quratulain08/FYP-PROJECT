"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import FocalPersonLayout from "../FocalPersonLayout"
import { Building, Users, Eye, Trash2, Plus, CheckCircle, AlertCircle, Calendar, MapPin, Clock } from "lucide-react"

interface Internship {
  _id: string
  title: string
  hostInstitution: string
  location: string
  category: string
  startDate: string
  endDate: string
  description: string
  assignedFaculty: string
  isApproved: boolean
  assignedStudents: string[]
  numberOfStudents: number
}

interface Faculty {
  _id: string
  name: string
}

interface Student {
  _id: string
  name: string
  department: string
  batch: string
  didInternship: boolean
  registrationNumber: string
  section: string
}

const AllInternships: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([])
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const router = useRouter()
  const departmentId = "674179f1d751474776dc5bd5"

  useEffect(() => {
    fetchInternships()
    fetchFaculties()
    fetchStudents()
  }, [])

  useEffect(() => {
    // Auto-dismiss notifications after 3 seconds
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const fetchInternships = async () => {
    try {
      const response = await fetch("/api/internships")
      if (!response.ok) throw new Error("Failed to fetch internships")

      const data = await response.json()
      setInternships(data)
    } catch (err) {
      setError("Error fetching internships.")
    } finally {
      setLoading(false)
    }
  }

  const fetchFaculties = async () => {
    try {
      const response = await fetch(`/api/faculty/department/${departmentId}`)
      if (!response.ok) throw new Error("Failed to fetch faculties")

      const data = await response.json()
      setFaculties(data)
    } catch (err) {
      setError("Error fetching faculties.")
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students")
      if (!response.ok) throw new Error("Failed to fetch students")

      const data = await response.json()
      setStudents(data)
    } catch (err) {
      setError("Error fetching students.")
    }
  }

  const handleAssignFaculty = async (internshipId: string, facultyId: string) => {
    if (window.confirm("Are you sure you want to assign this faculty member to the internship?")) {
      try {
        const response = await fetch(`/api/internships/${facultyId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ internshipId }),
        })

        const result = await response.json()

        if (response.ok) {
          setNotification({
            type: "success",
            message: result.message || "Faculty assigned successfully",
          })
          fetchInternships()
        } else {
          setNotification({
            type: "error",
            message: result.error || "Failed to assign faculty",
          })
        }
      } catch (error) {
        console.log("Error assigning faculty to internship:", error)
        setNotification({
          type: "error",
          message: "Failed to assign faculty. Please try again.",
        })
      }
    }
  }

  const handleAssignStudent = async (internshipId: string, studentId: string) => {
    if (window.confirm("Are you sure you want to assign this student to the internship?")) {
      try {
        const response = await fetch(`/api/InternshipsForStudnet/${studentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ internshipId }),
        })

        const result = await response.json()

        if (response.ok) {
          setNotification({
            type: "success",
            message: result.message || "Student assigned successfully",
          })
          fetchInternships()
        } else {
          setNotification({
            type: "error",
            message: result.error || "Failed to assign student",
          })
        }
      } catch (error) {
        console.log("Error assigning student:", error)
        setNotification({
          type: "error",
          message: "Failed to assign student. Please try again.",
        })
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this internship?")) {
      try {
        const response = await fetch(`/api/internships/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })

        const result = await response.json()

        if (response.ok) {
          setNotification({
            type: "success",
            message: result.message || "Internship deleted successfully",
          })
          fetchInternships()
        } else {
          setNotification({
            type: "error",
            message: result.error || "Failed to delete internship",
          })
        }
      } catch (error) {
        console.error("Error deleting internship:", error)
        setNotification({
          type: "error",
          message: "Failed to delete internship. Please try again.",
        })
      }
    }
  }

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Collect all assigned student IDs across all internships
  const allAssignedStudents: string[] = internships.reduce<string[]>((acc, internship) => {
    return [...acc, ...(internship.assignedStudents || [])]
  }, [])

  // Filter internships that are approved, have no assigned faculty, and don't have all student positions filled
  const filteredInternships = internships.filter(
    (internship) =>
      internship.isApproved === true &&
      internship.assignedFaculty.length === 0 &&
      internship.numberOfStudents !== internship.assignedStudents.length,
  )

  // Calculate summary statistics
  const totalPendingInternships = filteredInternships.length
  const totalStudentPositions = filteredInternships.reduce((sum, internship) => sum + internship.numberOfStudents, 0)
  const totalFilledPositions = filteredInternships.reduce(
    (sum, internship) => sum + (internship.assignedStudents ? internship.assignedStudents.length : 0),
    0,
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    )
  }

  return (
    <FocalPersonLayout>
      <div className="max-w-7xl mx-auto p-6">
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            <div className="flex items-center">
              {notification.type === "success" ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <span>{notification.message}</span>
              <button onClick={() => setNotification(null)} className="ml-4 text-sm hover:opacity-75">
                ×
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pending Assignments</h1>
            <p className="text-gray-600 mt-1">Internships that need faculty and student assignments</p>
          </div>
          <button
            onClick={() => router.push("/FocalPerson/createInternship")}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Internship
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Internships</p>
                <p className="text-2xl font-semibold text-gray-900">{totalPendingInternships}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Student Positions</p>
                <p className="text-2xl font-semibold text-gray-900">{totalStudentPositions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Filled Positions</p>
                <p className="text-2xl font-semibold text-gray-900">{totalFilledPositions}</p>
              </div>
            </div>
          </div>
        </div>

        {filteredInternships.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <p className="text-gray-600 text-lg">All internships have been assigned faculty and students.</p>
            <button
              onClick={() => router.push("/FocalPerson/internships")}
              className="mt-4 inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              View All Internships
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredInternships.map((internship) => (
              <div
                key={internship._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="border-l-4 border-amber-500 p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{internship.title}</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/FocalPerson/viewInternship/${internship._id}`)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(internship._id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete Internship"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-600 mb-4">
                    <Building className="mr-2 h-4 w-4" />
                    <span className="font-medium">{internship.hostInstitution}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="text-gray-500 mr-2 h-4 w-4" />
                        <span>{internship.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="text-gray-500 mr-2 h-4 w-4" />
                        <span>
                          {formatDate(internship.startDate)} - {formatDate(internship.endDate)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assign Faculty</label>
                        <select
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          defaultValue=""
                          onChange={(e) => handleAssignFaculty(internship._id, e.target.value)}
                        >
                          <option value="" disabled>
                            Select Faculty
                          </option>
                          {faculties.map((faculty) => (
                            <option key={faculty._id} value={faculty._id}>
                              {faculty.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="font-medium text-gray-700 mb-2">
                      Assign Students ({internship.assignedStudents ? internship.assignedStudents.length : 0}/
                      {internship.numberOfStudents} positions)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Array.from({ length: internship.numberOfStudents }).map((_, index) => (
                        <div key={index}>
                          <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            value={internship.assignedStudents?.[index] || ""}
                            onChange={(e) => handleAssignStudent(internship._id, e.target.value)}
                          >
                            <option value="" disabled>
                              Select Student
                            </option>
                            {students
                              .filter(
                                (student) =>
                                  !allAssignedStudents.includes(student._id) ||
                                  internship.assignedStudents?.includes(student._id),
                              )
                              .map((student) => (
                                <option key={student._id} value={student._id}>
                                  {student.registrationNumber} - {student.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FocalPersonLayout>
  )
}

export default AllInternships

