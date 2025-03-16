"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Eye,
  Pencil,
  Trash2,
  Mail,
  ChevronRight,
  Users,
  BookOpen,
  Calendar,
  Phone,
  AtSign,
  CreditCard,
  Building,
} from "lucide-react"
import CoordinatorLayout from "../../CoordinatorLayout"

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
        type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
  id: string
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

// Custom modal component
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DepartmentDetail() {
  const [department, setDepartment] = useState<Department | null>(null)
  const [facultyMembers, setFacultyMembers] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{ message: string; details?: string } | null>(null)
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [modalData, setModalData] = useState<{
    isOpen: boolean
    facultyId?: string
  }>({ isOpen: false })

  const params = useParams()
  const router = useRouter()
  const id = params.slug as string

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
      router.push(`/Coordinator/FacultyForm/${id}`)
    } else {
      setError({ message: "Department information is not available" })
    }
  }

  const handleEditFaculty = (faculty: Faculty) => {
    console.log("Editing faculty:", faculty)

    if (!faculty._id) {
      setNotification({
        type: "error",
        message: "Invalid faculty ID",
      })
      return
    }

    const editUrl = `/Coordinator/FacultyForm/${encodeURIComponent(id)}?edit=true&facultyId=${encodeURIComponent(faculty._id)}&readOnlyName=${encodeURIComponent(faculty.name)}&readOnlyCnic=${encodeURIComponent(faculty.cnic)}`
    router.push(editUrl)
  }

  const handleViewFaculty = (faculty: Faculty) => {
    router.push(`/Coordinator/FacultyView/${faculty._id}`)
  }

  const confirmDelete = (facultyId: string) => {
    setModalData({ isOpen: true, facultyId })
  }

  // Register Focal Person with a random password
  // sendEmail function to handle registration and email sending
  const sendEmail = async (email: string) => {
    try {
      const generateRandomPassword = () => {
        return Math.random().toString(36).slice(-8)
      }

      // Generate passwords for Coordinator and Focal Person
      const FacultyPassword = generateRandomPassword()

      // Register Focal Person with a random password
      const facultyResponse = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: FacultyPassword,
          role: "Faculty",
        }),
      })

      if (!facultyResponse.ok) {
        throw new Error("Error registering faculty Person")
      }
      console.log("faclty Person registered")

      // Send email notifications for both users
      const emailResponse = await fetch("/api/sendEmail-Faculty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          FacultyEmail: email,
          FacultyPassword: FacultyPassword,
        }),
      })

      if (!emailResponse.ok) {
        throw new Error("Error sending email")
      }

      setNotification({
        type: "success",
        message: "Email sent successfully",
      })

      console.log("Emails sent successfully")
    } catch (error) {
      console.error(error.message)
      setNotification({
        type: "error",
        message: "Failed to send email",
      })
    }
  }

  const handleDeleteFaculty = async (facultyId: string) => {
    if (!facultyId) {
      setNotification({
        type: "error",
        message: "Invalid faculty ID",
      })
      return
    }

    setLoading(true)
    try {
      console.log("Deleting faculty with ID:", facultyId)

      const response = await fetch(`/api/faculty/${facultyId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete faculty member")
      }

      const result = await response.json()
      console.log("Delete result:", result)

      setFacultyMembers((prevMembers) => prevMembers.filter((member) => member._id !== facultyId))

      setNotification({
        type: "success",
        message: "Faculty member deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting faculty member:", error)
      setNotification({
        type: "error",
        message: error instanceof Error ? `Error: ${error.message}` : "Failed to delete faculty member",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    window.location.reload()
  }

  // Get initials from department name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
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
    )
  }

  if (!department) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Department not found</p>
      </div>
    )
  }

  return (
    <CoordinatorLayout>
      <div className="max-w-7xl mx-auto p-6">
        {notification && (
          <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
        )}

        <ConfirmationModal
          isOpen={modalData.isOpen}
          onClose={() => setModalData({ isOpen: false })}
          onConfirm={() => {
            if (modalData.facultyId) {
              handleDeleteFaculty(modalData.facultyId)
            }
            setModalData({ isOpen: false })
          }}
          title="Confirm Delete"
          message="Are you sure you want to delete this faculty member? This action cannot be undone."
        />

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="hover:text-gray-700 cursor-pointer" onClick={() => router.push("/Coordinator/Departments")}>
            Departments
          </span>
          <ChevronRight className="mx-2 h-4 w-4" />
          <span className="font-medium text-green-600">{department.name}</span>
        </div>

        {/* Department Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Department Details</h1>
          <button
            onClick={handleAddFaculty}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
          >
            Add New Faculty
          </button>
        </div>

        {/* Department Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl font-bold mb-4 md:mb-0 md:mr-6">
                {getInitials(department.name)}
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800">{department.name}</h2>
                <p className="text-gray-600">
                  Head of Department: {department.honorific} {department.hodName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-base font-medium">{department.category}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Start Date</p>
                  <p className="text-base font-medium">{department.startDate}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">CNIC</p>
                  <p className="text-base font-medium">{department.cnic}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                  <AtSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base font-medium">{department.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-base font-medium">{department.phone}</p>
                </div>
              </div>

              {department.landLine && (
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Land Line</p>
                    <p className="text-base font-medium">{department.landLine}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Focal Person Card */}
        {department.focalPersonName && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800">Focal Person Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-base font-medium">
                      {department.focalPersonHonorific} {department.focalPersonName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">CNIC</p>
                    <p className="text-base font-medium">{department.focalPersonCnic}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <AtSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base font-medium">{department.focalPersonEmail}</p>
                  </div>
                </div>

                {department.focalPersonPhone && (
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-base font-medium">{department.focalPersonPhone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Faculty Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Faculty</p>
                <p className="text-2xl font-semibold text-gray-900">{facultyMembers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Professors</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {facultyMembers.filter((f) => f.academicRank === "Professor").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Permanent Faculty</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {facultyMembers.filter((f) => f.contractType === "Permanent").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Faculty Members Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Faculty Members</h3>
          </div>

          {facultyMembers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No faculty members found</p>
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
                      Academic Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contract Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {facultyMembers.map((faculty, index) => {
                    // Get initials for faculty avatar
                    const facultyInitials = faculty.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                      .substring(0, 2)

                    return (
                      <tr key={faculty._id || `faculty-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                              {facultyInitials}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {faculty.honorific} {faculty.name}
                              </div>
                              <div className="text-sm text-gray-500">{faculty.gender}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculty.cnic}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {faculty.academicRank}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              faculty.contractType === "Permanent"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {faculty.contractType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculty.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleViewFaculty(faculty)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEditFaculty(faculty)}
                              className="text-green-600 hover:text-green-900"
                              title="Edit"
                              disabled={loading}
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => sendEmail(faculty.email)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Send Email"
                              disabled={loading}
                            >
                              <Mail size={18} />
                            </button>
                            <button
                              onClick={() => confirmDelete(faculty._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                              disabled={loading}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </CoordinatorLayout>
  )
}

