"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Eye, Pencil, Trash2, Mail, User, Calendar, Tag, Phone, FileText, UserPlus, GraduationCap } from "lucide-react"
import Layout from "@/app/components/Layout"

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
  focalPersonName: ""
  focalPersonHonorific: "Mr."
  focalPersonCnic: ""
  focalPersonEmail: ""
  focalPersonPhone: ""
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
      router.push(`/admin/FacultyForm/${id}`)
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

    const editUrl = `/admin/Edit-Faculty/${faculty._id}`
    router.push(editUrl)
  }

  const handleViewFaculty = (faculty: Faculty) => {
    router.push(`/admin/FacultyView/${faculty._id}`)
  }

  const confirmDelete = (facultyId: string) => {
    setModalData({ isOpen: true, facultyId })
  }

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
      console.log("Emails sent successfully")

      setNotification({
        type: "success",
        message: "Email sent successfully",
      })
    } catch (error) {
      console.error(error.message)
      setNotification({
        type: "error",
        message: "Error sending email",
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

  // Get department initials (up to 2 characters)
  const getDepartmentInitials = () => {
    if (!department) return ""

    const words = department.name.split(" ")
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return department.name.substring(0, 2).toUpperCase()
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
    <Layout>
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

        {/* Department Card with Circle Design */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 mb-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-28 h-28 rounded-full bg-green-500 flex items-center justify-center mb-4">
              <span className="text-white font-bold text-3xl">{getDepartmentInitials()}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">{department.name}</h1>
            <p className="text-lg text-gray-600 text-center mb-6">
              {department.honorific} {department.hodName}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start gap-3">
              <Tag className="text-green-500 w-5 h-5 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium text-gray-800">{department.category}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-green-500 w-5 h-5 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium text-gray-800">{department.startDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="text-green-500 w-5 h-5 mt-1" />
              <div>
                <p className="text-sm text-gray-500">CNIC</p>
                <p className="font-medium text-gray-800">{department.cnic}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-green-500 w-5 h-5 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{department.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-green-500 w-5 h-5 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">{department.phone}</p>
              </div>
            </div>

            {department.landLine && (
              <div className="flex items-start gap-3">
                <Phone className="text-green-500 w-5 h-5 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Land Line</p>
                  <p className="font-medium text-gray-800">{department.landLine}</p>
                </div>
              </div>
            )}

            {department.focalPersonName && (
              <div className="flex items-start gap-3">
                <User className="text-green-500 w-5 h-5 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Focal Person</p>
                  <p className="font-medium text-gray-800">
                    {department.focalPersonHonorific} {department.focalPersonName}
                  </p>
                </div>
              </div>
            )}

            {department.focalPersonEmail && (
              <div className="flex items-start gap-3">
                <Mail className="text-green-500 w-5 h-5 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Focal Person Email</p>
                  <p className="font-medium text-gray-800">{department.focalPersonEmail}</p>
                </div>
              </div>
            )}

            {department.focalPersonCnic && (
              <div className="flex items-start gap-3">
                <FileText className="text-green-500 w-5 h-5 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Focal Person CNIC</p>
                  <p className="font-medium text-gray-800">{department.focalPersonCnic}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Faculty Members Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-600 flex items-center">
              <GraduationCap className="mr-2 h-6 w-6" />
              Faculty Members
            </h2>
            <button
              onClick={handleAddFaculty}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300 flex items-center gap-2"
            >
              <UserPlus size={18} />
              Add New Faculty
            </button>
          </div>

          {facultyMembers.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg shadow p-12 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <p className="text-gray-600 text-lg">No faculty members found</p>
              <button
                onClick={handleAddFaculty}
                className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition duration-300 inline-flex items-center gap-2"
              >
                <UserPlus size={18} />
                Add Your First Faculty Member
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        CNIC
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Academic Rank
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Contract Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {facultyMembers.map((faculty) => (
                      <tr key={faculty._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                              {faculty.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {faculty.honorific} {faculty.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculty.cnic}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculty.academicRank}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {faculty.contractType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculty.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
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
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => sendEmail(faculty.email)}
                              className="text-purple-600 hover:text-purple-900"
                              title="Send Email"
                            >
                              <Mail size={18} />
                            </button>
                            <button
                              onClick={() => confirmDelete(faculty._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

