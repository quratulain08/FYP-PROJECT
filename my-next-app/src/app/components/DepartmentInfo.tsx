"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FaEdit, FaTrash } from "react-icons/fa"
import { Calendar, Tag, Phone, Mail, Info, Plus, User } from "lucide-react"

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
  focalPersonName: ""
  focalPersonHonorific: "Mr."
  focalPersonCnic: ""
  focalPersonEmail: ""
  focalPersonPhone: ""
}

// Department Card Component
const DepartmentCard = ({
  department,
  onCardClick,
  onEdit,
  onDelete,
}: {
  department: Department
  onCardClick: () => void
  onEdit: (e: React.MouseEvent) => void
  onDelete: (e: React.MouseEvent) => void
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Get department initials (up to 2 characters)
  const getInitials = () => {
    const words = department.name.split(" ")
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return department.name.substring(0, 2).toUpperCase()
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${isHovered ? "border-green-400" : ""} cursor-pointer`}
      onClick={onCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Action Buttons */}
      <div className="flex justify-end p-3">
        <div className="flex space-x-2">
          <button onClick={onEdit} className="text-gray-400 hover:text-yellow-500 p-1 transition-colors" title="Edit">
            <FaEdit size={16} />
          </button>
          <button onClick={onDelete} className="text-gray-400 hover:text-red-500 p-1 transition-colors" title="Delete">
            <FaTrash size={16} />
          </button>
        </div>
      </div>

      {/* Circle with Department Initials */}
      <div className="flex flex-col items-center justify-center p-6 pt-0">
        <div
          className={`w-24 h-24 rounded-full bg-green-400 flex items-center justify-center mb-4 transition-all duration-300 ${isHovered ? "transform scale-110" : ""}`}
        >
          <span className="text-white font-bold text-2xl">{getInitials()}</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 text-center mb-2">{department.name}</h2>
        <p className="text-sm text-gray-500 text-center">
          {department.honorific} {department.hodName}
        </p>
      </div>

      {/* Department Details - Visible on Hover */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isHovered ? "max-h-96" : "max-h-0"}`}>
        <div className="p-6 pt-0 border-t border-gray-100">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3">
              <Tag className="text-green-500 w-4 h-4" />
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm font-medium text-gray-800">{department.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-green-500 w-4 h-4" />
              <div>
                <p className="text-xs text-gray-500">Start Date</p>
                <p className="text-sm font-medium text-gray-800">{department.startDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-green-500 w-4 h-4" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-800">{department.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-green-500 w-4 h-4" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-800">{department.phone}</p>
              </div>
            </div>

            {department.focalPersonName && (
              <div className="flex items-center gap-3">
                <User className="text-green-500 w-4 h-4" />
                <div>
                  <p className="text-xs text-gray-500">Focal Person</p>
                  <p className="text-sm font-medium text-gray-800">
                    {department.focalPersonHonorific} {department.focalPersonName}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const DepartmentInfo: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/department")
      if (!response.ok) throw new Error("Failed to fetch departments")

      const data = await response.json()
      setDepartments(data)
    } catch (err) {
      setError("Error fetching department information.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        const response = await fetch(`/api/department/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })

        const result = await response.json()

        if (response.ok) {
          alert(result.message)
          fetchDepartments()
        } else {
          alert(`Error: ${result.error}`)
        }
      } catch (error) {
        console.error("Error deleting department:", error)
        alert("Failed to delete department.")
      }
    }
  }

  const handleDepartmentClick = (id: string) => {
    router.push(`/admin/Program/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/editDepartment/${id}`)
  }

  const handleAddNewDepartment = () => {
    localStorage.removeItem("editingDepartment")
    router.push("/admin/DepartmentForm")
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl w-full">
          <h2 className="text-red-700 text-xl font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={handleAddNewDepartment}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300 flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Department
        </button>
      </div>

      {departments.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow p-12 text-center">
          <Info className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <p className="text-gray-600 text-lg">No departments available.</p>
          <button
            onClick={handleAddNewDepartment}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition duration-300 inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Create Your First Department
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <DepartmentCard
              key={dept._id}
              department={dept}
              onCardClick={() => handleDepartmentClick(dept._id)}
              onEdit={(e) => {
                e.stopPropagation()
                handleEdit(dept._id)
              }}
              onDelete={(e) => {
                e.stopPropagation()
                handleDelete(dept._id)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default DepartmentInfo

