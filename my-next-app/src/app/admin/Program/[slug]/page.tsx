"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Layout from "@/app/components/Layout"
import { FaEdit, FaTrash } from "react-icons/fa"
import { Calendar, Tag, Phone, Mail, User, Clock, FileText, Plus, BookOpen } from "lucide-react"

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

interface Program {
  _id: string
  name: string
  departmentId: string
  startDate: string
  category: string
  durationYears: number
  description?: string
  contactEmail: string
  contactPhone?: string
  programHead: string
  programHeadContact?: {
    email?: string
    phone?: string
  }
  programObjectives?: string[]
}

// Program Card Component
const ProgramCard = ({
  program,
  onEdit,
  onDelete,
}: {
  program: Program
  onEdit: () => void
  onDelete: () => void
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Get program initials (up to 2 characters)
  const getInitials = () => {
    const words = program.name.split(" ")
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return program.name.substring(0, 2).toUpperCase()
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${isHovered ? "border-green-400" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Action Buttons */}
      <div className="flex justify-end p-3">
        <div className="flex space-x-2">
          <button onClick={onEdit} className="text-gray-400 hover:text-blue-500 p-1 transition-colors" title="Edit">
            <FaEdit size={16} />
          </button>
          <button onClick={onDelete} className="text-gray-400 hover:text-red-500 p-1 transition-colors" title="Delete">
            <FaTrash size={16} />
          </button>
        </div>
      </div>

      {/* Circle with Program Initials */}
      <div className="flex flex-col items-center justify-center p-6 pt-0">
        <div
          className={`w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4 transition-all duration-300 ${isHovered ? "transform scale-110" : ""}`}
        >
          <span className="text-white font-bold text-xl">{getInitials()}</span>
        </div>
        <h2 className="text-lg font-bold text-gray-800 text-center mb-2">{program.name}</h2>
        <p className="text-sm text-gray-500 text-center mb-2">{program.category}</p>
        <div className="flex items-center justify-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1 text-green-500" />
          <span>{program.durationYears} years</span>
        </div>
      </div>

      {/* Program Details - Visible on Hover */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isHovered ? "max-h-96" : "max-h-0"}`}>
        <div className="p-6 pt-0 border-t border-gray-100">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3">
              <Calendar className="text-green-500 w-4 h-4" />
              <div>
                <p className="text-xs text-gray-500">Start Date</p>
                <p className="text-sm font-medium text-gray-800">{program.startDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="text-green-500 w-4 h-4" />
              <div>
                <p className="text-xs text-gray-500">Program Head</p>
                <p className="text-sm font-medium text-gray-800">{program.programHead}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-green-500 w-4 h-4" />
              <div>
                <p className="text-xs text-gray-500">Contact Email</p>
                <p className="text-sm font-medium text-gray-800">{program.contactEmail}</p>
              </div>
            </div>

            {program.contactPhone && (
              <div className="flex items-center gap-3">
                <Phone className="text-green-500 w-4 h-4" />
                <div>
                  <p className="text-xs text-gray-500">Contact Phone</p>
                  <p className="text-sm font-medium text-gray-800">{program.contactPhone}</p>
                </div>
              </div>
            )}

            {program.description && (
              <div className="flex items-start gap-3 mt-2">
                <FileText className="text-green-500 w-4 h-4 mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="text-sm font-medium text-gray-800">{program.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DepartmentDetail() {
  const [department, setDepartment] = useState<Department | null>(null)
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ message: string; details?: string } | null>(null)
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
    const fetchData = async () => {
      try {
        if (!id) {
          setError({ message: "Department ID is missing" })
          return
        }

        // Fetch department data
        const deptData: Department = await fetchWithErrorHandling(`/api/department/${id}`)
        console.log("Department Data:", deptData)
        setDepartment(deptData)

        // Attempt to fetch program data
        try {
          const programData: Program[] = await fetchWithErrorHandling(`/api/program/${id}`)
          console.log("Program Data:", programData)
          setPrograms(programData)
        } catch (programError) {
          console.warn("Failed to fetch programs:", programError)
          setPrograms([])
        }

        setError(null)
      } catch (err) {
        console.error("Error fetching department:", err)
        let errorMessage = "Error fetching department data"
        let errorDetails = ""

        if (err instanceof Error) {
          errorMessage = err.message
          errorDetails = err.stack || ""
        }

        setError({
          message: errorMessage,
          details: errorDetails,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    window.location.reload()
  }

  const handleAddNewProgram = () => {
    console.log(`${id}`)
    router.push(`/admin/Add-program/${id}`)
  }

  const handleEdit = (programId: string) => {
    router.push(`/admin/Edit-program/${programId}/${id}`)
  }

  const handleDelete = async (programId: string) => {
    const confirmation = window.confirm("Are you sure you want to delete this program?")
    if (confirmation) {
      try {
        const response = await fetch(`/api/program/${programId}`, {
          method: "DELETE",
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error deleting program")
        }
        setPrograms((prevPrograms) => prevPrograms.filter((program) => program._id !== programId))
        alert("Program deleted successfully!")
      } catch (error) {
        alert("Error deleting program: " + error.message)
      }
    }
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

        {/* Programs Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-600 flex items-center">
              <BookOpen className="mr-2 h-6 w-6" />
              Programs
            </h2>
            <button
              onClick={handleAddNewProgram}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300 flex items-center gap-2"
            >
              <Plus size={18} />
              Add New Program
            </button>
          </div>

          {programs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <ProgramCard
                  key={program._id}
                  program={program}
                  onEdit={() => handleEdit(program._id)}
                  onDelete={() => handleDelete(program._id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg shadow p-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <p className="text-gray-600 text-lg">No programs available for this department.</p>
              <button
                onClick={handleAddNewProgram}
                className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition duration-300 inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Add Your First Program
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

