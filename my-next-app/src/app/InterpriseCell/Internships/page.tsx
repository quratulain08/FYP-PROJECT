"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import InterpriseCellLayout from "../InterpriseCellLayout"
import {
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Briefcase,
  Building,
  AlertCircle,
  Search,
  Filter,
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
  assignedStudents: string
  isApproved: boolean
}

const Internships: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([])
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending">("all")
  const router = useRouter()

  useEffect(() => {
    fetchInternships()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, filterStatus, internships])

  const applyFilters = () => {
    let filtered = [...internships]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (internship) =>
          internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.hostInstitution.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (filterStatus === "approved") {
      filtered = filtered.filter((internship) => internship.isApproved)
    } else if (filterStatus === "pending") {
      filtered = filtered.filter((internship) => !internship.isApproved)
    }

    setFilteredInternships(filtered)
  }

  const fetchInternships = async () => {
    try {
      const response = await fetch("/api/internships")
      if (!response.ok) throw new Error("Failed to fetch internships")

      const data = await response.json()
      setInternships(data)
      setFilteredInternships(data)
    } catch (err) {
      setError("Error fetching internships.")
    } finally {
      setLoading(false)
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
          alert(result.message)
          fetchInternships()
        } else {
          alert(`Error: ${result.error}`)
        }
      } catch (error) {
        console.error("Error deleting internship:", error)
        alert("Failed to delete internship.")
      }
    }
  }

  const handleApprove = async (id: string, isCurrentlyApproved: boolean) => {
    if (window.confirm(`Are you sure you want to ${isCurrentlyApproved ? "unapprove" : "approve"} this internship?`)) {
      try {
        const response = await fetch(`/api/InternshipForInterpriseCell`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isApproved: !isCurrentlyApproved, id }),
        })

        const result = await response.json()

        if (response.ok) {
          alert(result.message)
          fetchInternships()
        } else {
          alert(`Error: ${result.error}`)
        }
      } catch (error) {
        console.error("Error approving internship:", error)
        alert("Failed to update approval status.")
      }
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
      return new Date(dateString).toLocaleDateString(undefined, options)
    } catch (e) {
      return dateString
    }
  }

  if (loading) {
    return (
      <InterpriseCellLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
            <p className="text-gray-600 font-medium" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              Loading internships...
            </p>
          </div>
        </div>
      </InterpriseCellLayout>
    )
  }

  if (error) {
    return (
      <InterpriseCellLayout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3
                className="text-lg font-semibold text-red-700 mb-1"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Error Loading Internships
              </h3>
              <p className="text-red-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </InterpriseCellLayout>
    )
  }

  return (
    <InterpriseCellLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1
            className="text-3xl font-bold text-green-600 mb-4 md:mb-0"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
            Internship Management
          </h1>

          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search internships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full md:w-64"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "all" | "approved" | "pending")}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full appearance-none"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending Approval</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p
                  className="text-gray-500 font-medium mb-1"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Total
                </p>
                <h2
                  className="text-2xl font-bold text-gray-800"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {internships.length}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p
                  className="text-gray-500 font-medium mb-1"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Approved
                </p>
                <h2
                  className="text-2xl font-bold text-gray-800"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {internships.filter((i) => i.isApproved).length}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-500">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg mr-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p
                  className="text-gray-500 font-medium mb-1"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Pending
                </p>
                <h2
                  className="text-2xl font-bold text-gray-800"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {internships.filter((i) => !i.isApproved).length}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {filteredInternships.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <Briefcase className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3
              className="text-xl font-medium text-gray-900 mb-2"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              No internships found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search filters to find what you're looking for."
                : "There are no internships available in the system yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredInternships.map((internship) => (
              <div
                key={internship._id}
                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div className="flex items-start mb-3 md:mb-0">
                      <div
                        className={`flex-shrink-0 w-2 h-12 rounded-full mr-4 ${internship.isApproved ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <div>
                        <h2
                          className="text-xl font-semibold text-gray-800"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          {internship.title}
                        </h2>
                        <div className="flex items-center mt-1">
                          <Building className="h-4 w-4 text-gray-500 mr-1" />
                          <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                            {internship.hostInstitution}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          internship.isApproved ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        {internship.isApproved ? "Approved" : "Pending Approval"}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleApprove(internship._id, internship.isApproved)
                        }}
                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                          internship.isApproved
                            ? "bg-red-50 text-red-700 hover:bg-red-100"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        } transition-colors duration-200`}
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        {internship.isApproved ? (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Unapprove
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(internship._id)
                        }}
                        className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        title="Delete"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <Briefcase className="h-5 w-5 text-green-600 mr-3" />
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium text-gray-500"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            Category
                          </p>
                          <p className="text-gray-700" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                            {internship.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <Calendar className="h-5 w-5 text-green-600 mr-3" />
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium text-gray-500"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            Duration
                          </p>
                          <p className="text-gray-700" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                            {formatDate(internship.startDate)} - {formatDate(internship.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <MapPin className="h-5 w-5 text-green-600 mr-3" />
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium text-gray-500"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            Location
                          </p>
                          <p className="text-gray-700" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                            {internship.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <Building className="h-5 w-5 text-green-600 mr-3" />
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium text-gray-500"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            Description
                          </p>
                          <p
                            className="text-gray-700 line-clamp-2"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            {internship.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <span
                        className="text-sm text-gray-500"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        ID: {internship._id.substring(0, 8)}...
                      </span>
                    </div>
                    <button
                      onClick={() => router.push(`/InterpriseCell/internships/${internship._id}`)}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </InterpriseCellLayout>
  )
}

export default Internships

