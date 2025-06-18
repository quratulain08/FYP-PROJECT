"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import FocalPersonLayout from "../FocalPersonLayout"
import {
  Briefcase,
  Building,
  Users,
  User,
  Eye,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
} from "lucide-react"

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
  assignedStudents: string[]
  isApproved: boolean
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
  cgpa: number
}

const Internships: React.FC = () => {
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
  // const [departmentId, setDepartmentId] = useState(null);

  useEffect(() => {
    fetchInternships()
  }, [])

  const fetchInternships = async () => {
    try {
      const email = localStorage.getItem("email");
      if (!email) return;

      const response1 = await fetch(`/api/departmentByfocalperson/${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    
      if (!response1.ok) {
        throw new Error(`Failed to fetch department ID for ${email}`);
      }
    
      const dataa = await response1.json();
      const departmentId = dataa._id;
    
      if (!departmentId) {
        throw new Error("Department ID not found");
      }
    
      // setDepartmentId(departmentId);
    
      const res = await fetch(`/api/internshipByDepartment/${departmentId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch internships");
      }
      const data = await res.json();
      setInternships(data);
      fetchFaculties(departmentId);
    } catch (err) {
      console.error(err);
      setError("Error fetching internships.");
    } finally {
      setLoading(false);
    }
  }

  const fetchFaculties = async (deptId: string) => { 
       try {
      const response = await fetch(`/api/faculty/department/${deptId}`)
      if (!response.ok) throw new Error("Failed to fetch faculties")

      const data = await response.json()
      setFaculties(data)
      fetchStudents(deptId)
    } catch (err) {
      setError("Error fetching faculties.")
    }
  }

  const fetchStudents = async (deptId: string) => {
    try {
      const email = localStorage.getItem("email");
      const response2 = await fetch(`/api/UniversityByEmailAdmin/${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
     
if (!response2.ok) {
  throw new Error(`Failed to fetch university ID for ${email}`);
}

const dataa = await response2.json();
const universityId = dataa.universityId; // Access the correct property
      
      const res = await fetch(`/api/studentsByDepartment/${deptId}/${universityId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }, // Missing comma here
      });
       if (!res.ok) throw new Error("Failed to fetch students")

      const data = await res.json()
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

  // Filter internships that are approved and have assigned students or faculty
  const filteredInternships = internships.filter(
    (internship) =>
      (internship.assignedStudents?.length === 0 || internship.assignedFaculty?.length === 0) &&
      internship.isApproved === true,
  )

  // Calculate summary statistics
  const totalInternships = filteredInternships.length
  const totalAssignedFaculty = filteredInternships.filter(
    (i) => i.assignedFaculty && i.assignedFaculty.length > 0,
  ).length
  const totalAssignedStudents = allAssignedStudents.length

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // if (error) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
  //     </div>
  //   )
  // }

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
          <h1 className="text-2xl font-bold text-gray-800">Internship Management</h1>
          {/* <button
            onClick={() => router.push("/FocalPerson/createInternship")}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Internship
          </button> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Internships</p>
                <p className="text-2xl font-semibold text-gray-900">{totalInternships}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned Faculty</p>
                <p className="text-2xl font-semibold text-gray-900">{totalAssignedFaculty}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned Students</p>
                <p className="text-2xl font-semibold text-gray-900">{totalAssignedStudents}</p>
              </div>
            </div>
          </div>
        </div>

        {filteredInternships.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No internships available at the moment.</p>
            <button
              onClick={() => router.push("/FocalPerson/createInternship")}
              className="mt-4 inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Internship
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredInternships.map((internship) => (
              <div
                key={internship._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="border-l-4 border-green-500 p-6">
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

                  <div className="flex items-center text-green-600 mb-4">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Faculty</label>
                        <select
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          value={internship.assignedFaculty || ""}
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
                      Assigned Students ({internship.numberOfStudents} positions)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Array.from({ length: internship.numberOfStudents }).map((_, index) => (
                        <div key={index}>
                          <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                  {student.registrationNumber} - {student.name} - {student.cgpa}
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

export default Internships

