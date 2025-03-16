"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Info } from "lucide-react"

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

// Department Card Component
const DepartmentCard = ({
  department,
  onClick,
}: {
  department: Department
  onClick: () => void
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
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center justify-center p-6">
        <div
          className={`w-20 h-20 rounded-full bg-green-400 flex items-center justify-center mb-4 transition-all duration-300 ${isHovered ? "transform scale-110" : ""}`}
        >
          <span className="text-white font-bold text-2xl">{getInitials()}</span>
        </div>
        <h2 className="text-lg font-bold text-gray-800 text-center mb-2">{department.name}</h2>
        <p className="text-sm text-gray-500 text-center mb-4">
          {department.honorific} {department.hodName}
        </p>
        <button
          className={`px-4 py-2 rounded-md transition-colors ${
            isHovered ? "bg-green-500 text-white" : "bg-white text-green-500 border border-green-500"
          }`}
        >
          View Details
        </button>
      </div>
    </div>
  )
}

const DepartmentList: React.FC = () => {
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

  const handleDepartmentClick = (id: string) => {
    router.push(`/admin/Department/${id}`)
  }

  const handleAddNewDepartment = () => {
    router.push("/admin/DepartmentForm")
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
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
  
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
            <DepartmentCard key={dept._id} department={dept} onClick={() => handleDepartmentClick(dept._id)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default DepartmentList

