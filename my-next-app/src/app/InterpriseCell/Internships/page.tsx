"use client"

import type React from "react"
import MakeAInternship from "../makeAInternship/page"; // Adjust the import path based on your file structure
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import InterpriseCellLayout from "../InterpriseCellLayout"
import GradeReports from "../gradeReport/page"; // Adjust path as necessary

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
type Department = {
  _id: string
  name: string
}

const Internships: React.FC = () => {
  // Add this style tag
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [visibleInternshipId, setVisibleInternshipId] = useState<string | null>(null);

  const fadeInAnimation = `
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.2s ease-out forwards;
    }
  `
  const [internships, setInternships] = useState<Internship[]>([])
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [showPopup, setShowPopup] = useState(false)
  const [showRejectPopup, setShowRejectPopup] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending">("all")
  const router = useRouter()

  useEffect(() => {
    fetchInternships()
    fetchDepartments()
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
      const email = localStorage.getItem("email")
      const res = await fetch(`/api/UniversityByEmailAdmin/${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch university ID for ${email}`)
      }

      const dataa = await res.json()
      // Assuming the response is an object with the universityId property
      const universityId = dataa.universityId

      const response = await fetch(`/api/internshipsByUniversity/${universityId}`)
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

  const fetchDepartments = async () => {
    try {
      const email = localStorage.getItem("email")
      const res = await fetch(`/api/UniversityByEmailAdmin/${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch university ID for ${email}`)
      }

      const dataa = await res.json()
      // Assuming the response is an object with the universityId property
      const universityId = dataa.universityId

      const response = await fetch(`/api/departmentByUniversity/${universityId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) throw new Error("Failed to fetch departments")

      const data = await response.json()
      setDepartments(data)
    } catch (err) {
      setError("Error fetching department.")
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
  const handleAssignDepartment = async (internshipId: string, departmentId: string) => {
    const confirmAssign = confirm("Are you sure you want to assign this department?")
    if (!confirmAssign) return

    try {
      const response = await fetch(`/api/InternshipForInterpriseCell`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: internshipId, isApproved: true, departmentId }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Failed to assign department:", data.error)
        return
      }

      setSuccessMessage("✅ Internship successfully assigned to department!")
      setTimeout(() => setSuccessMessage(null), 3000)
      setShowPopup(false)
      fetchInternships()
    } catch (error) {
      console.error("Error assigning department:", error)
    }
  }

  const handleRejectInternship = async (internshipId: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection.")
      return
    }

    try {
      const response = await fetch(`/api/InternshipForInterpriseCell`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: internshipId, isApproved: false, rejectionComment: rejectionReason }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Failed to reject internship:", data.error)
        return
      }

      setSuccessMessage("❌ Internship rejected successfully!")
      setTimeout(() => setSuccessMessage(null), 3000)
      setShowRejectPopup(false)
    } catch (error) {
      console.error("Error rejecting internship:", error)
    }
  }
  // Function to handle showing the popup
  const handleShowPopup = () => {
    setPopupVisible(true);
  };

  // Function to handle hiding the popup
  const handleClosePopup = () => {
    setPopupVisible(false);
    fetchInternships()

  };


  return (
    <InterpriseCellLayout>
      <style>{fadeInAnimation}</style>
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

        <div className="flex justify-between items-center mb-8">
      {/* This is your button on the right */}
      <button
        onClick={handleShowPopup}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
        Add Internship
      </button>

      {/* Popup (MakeAInternship) */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
            <MakeAInternship
              universityId="someUniversityId"
              onSuccess={(newInternship) => {
                console.log("Internship created successfully:", newInternship);
                handleClosePopup(); // Close the popup after success
              }}
            />
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-gray-500"
            >
              X
            </button>
          </div>
        </div>
      )}
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
                        onClick={() => setShowPopup(true)}
                        className="bg-teal-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                         Assign 
                      </button>

                      {showPopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
                          <div className="bg-white rounded-xl shadow-2xl w-96 overflow-hidden animate-fadeIn">
                            <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4">
                              <h2 className="text-xl font-semibold text-white flex items-center">
                                <Briefcase className="h-5 w-5 mr-2" />
                                Assign Department
                              </h2>
                            </div>
                            <div className="p-6">
                              {loading ? (
                                <div className="flex justify-center items-center py-8">
                                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                                </div>
                              ) : error ? (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                  <p className="text-red-600 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    {error}
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <p className="text-gray-600 mb-4">
                                    Select a department to assign this internship to:
                                  </p>
                                  <div className="max-h-60 overflow-auto border border-gray-200 rounded-lg mb-4">
                                    {departments.length === 0 ? (
                                      <div className="p-4 text-center text-gray-500">No departments available</div>
                                    ) : (
                                      <ul className="divide-y divide-gray-200">
                                        {departments.map((dept) => (
                                          <li key={dept._id} className="hover:bg-gray-50 transition-colors">
                                            <button
                                              className="w-full px-4 py-3 flex justify-between items-center text-left"
                                              onClick={() => handleAssignDepartment(internship._id, dept._id)}
                                            >
                                              <span className="font-medium text-gray-700">{dept.name}</span>
                                              <span className="text-teal-600 hover:text-teal-700">
                                                <CheckCircle className="h-5 w-5" />
                                              </span>
                                            </button>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                </>
                              )}
                              <div className="flex justify-end space-x-3 mt-2">
                                <button
                                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                  onClick={() => setShowPopup(false)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <button
                        className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => setShowRejectPopup(true)}
                      >
                        Reject
                      </button>

                      
                      {showRejectPopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
                          <div className="bg-white rounded-xl shadow-2xl w-96 overflow-hidden animate-fadeIn">
                            <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4">
                              <h2 className="text-xl font-semibold text-white flex items-center">
                                <XCircle className="h-5 w-5 mr-2" />
                                Reject Internship
                              </h2>
                            </div>
                            <div className="p-6">
                              <p className="text-gray-600 mb-4">
                                Please provide a reason for rejecting this internship:
                              </p>
                              <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4 h-32 resize-none"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter detailed reason for rejection..."
                              ></textarea>
                              <div className="flex justify-end space-x-3">
                                <button
                                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                  onClick={() => setShowRejectPopup(false)}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                                  onClick={() => handleRejectInternship(internship._id)}
                                  disabled={!rejectionReason.trim()}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Confirm Rejection
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
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

                    <button
className="
     bg-gradient-to-r from-green-500 to-teal-400 
     text-white font-medium 
     px-5 py-2 rounded-lg 
     shadow-md hover:shadow-lg 
     transition-all duration-200 
     hover:from-green-600 hover:to-teal-500 
     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-300
   "                onClick={() =>
                  setVisibleInternshipId(visibleInternshipId === internship._id ? null : internship._id)
                }
              >
                {visibleInternshipId === internship._id ? "Hide Grade Reports" : "View Grade Reports"}
              </button>
            

            {visibleInternshipId === internship._id && (
              <div className="mt-4">
                <GradeReports internshipId={internship._id} />
              </div>
            )}

                      
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
