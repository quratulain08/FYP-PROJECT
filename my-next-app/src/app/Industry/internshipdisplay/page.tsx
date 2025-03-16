"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, Calendar, MapPin, Building, Search, Filter, X, Plus, ChevronRight } from "lucide-react"
import IndustryLayout from "../IndustryLayout"

interface Internship {
  _id: string
  title: string
  hostInstitution: string
  location: string
  category: string
  startDate: string
  endDate: string
  description: string
  compensationType?: "paid" | "unpaid"
  compensationAmount?: number
  numberOfStudents?: number
}

const InternshipDisplay = () => {
  const [internships, setInternships] = useState<Internship[]>([])
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchInternships()
  }, [])

  useEffect(() => {
    filterInternships()
  }, [searchTerm, filterCategory, internships])

  const fetchInternships = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/internships")
      if (!response.ok) throw new Error("Failed to fetch internships")

      const data = await response.json()
      setInternships(data)
      setFilteredInternships(data)
    } catch (err) {
      setError("Error fetching internships.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filterInternships = () => {
    let filtered = [...internships]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (internship) =>
          internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.hostInstitution.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter((internship) => internship.category === filterCategory)
    }

    setFilteredInternships(filtered)
  }

  const handleCardClick = (id: string) => {
    router.push(`/Industry/internships/${id}`)
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click

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

  const clearFilters = () => {
    setSearchTerm("")
    setFilterCategory("")
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

  const getCategoryLabel = (categoryValue: string) => {
    const categories = [
      { value: "frontend", label: "Frontend Development" },
      { value: "backend", label: "Backend Development" },
      { value: "fullstack", label: "Full Stack Development" },
      { value: "mobile", label: "Mobile Development" },
      { value: "data", label: "Data Science" },
      { value: "ai", label: "Artificial Intelligence" },
      // Add more categories as needed
    ]

    const category = categories.find((c) => c.value === categoryValue)
    return category ? category.label : categoryValue
  }

  // Get unique categories
  const categories = [...new Set(internships.map((internship) => internship.category))]

  if (loading)
    return (
      <IndustryLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </div>
      </IndustryLayout>
    )

  if (error)
    return (
      <IndustryLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>{error}</p>
          </div>
        </div>
      </IndustryLayout>
    )

  return (
    <IndustryLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1
            className="text-3xl font-bold text-green-600 mb-4 md:mb-0"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
            All Internships
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
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full appearance-none"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category)}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {(searchTerm || filterCategory) && (
              <button
                onClick={clearFilters}
                className="flex items-center justify-center text-gray-600 hover:text-gray-800"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => router.push("/Industry/createinternship")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
            <Plus className="h-4 w-4" />
            <span>Create Internship</span>
          </button>
        </div>

        {filteredInternships.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3
              className="mt-4 text-lg font-medium text-gray-900"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              No internships found
            </h3>
            <p className="mt-2 text-sm text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              {searchTerm || filterCategory
                ? "Try adjusting your search filters"
                : "No internships are currently available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((internship) => (
              <div
                key={internship._id}
                onClick={() => handleCardClick(internship._id)}
                className="bg-white border border-gray-200 hover:border-green-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h2
                      className="text-xl font-semibold text-gray-800 line-clamp-2"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      {internship.title}
                    </h2>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {getCategoryLabel(internship.category)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Building className="h-4 w-4 mr-2 text-green-600" />
                      <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        {internship.hostInstitution}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-green-600" />
                      <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        {internship.location === "onsite"
                          ? "On-site"
                          : internship.location === "oncampus"
                            ? "On-campus"
                            : internship.location}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-green-600" />
                      <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        {formatDate(internship.startDate)} - {formatDate(internship.endDate)}
                      </span>
                    </div>
                  </div>

                  <p
                    className="text-gray-600 line-clamp-3 mb-4"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    {internship.description}
                  </p>
                </div>

                <div className="bg-green-50 p-3 flex justify-between items-center">
                  <div
                    className="flex items-center text-green-600 font-medium"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Assign Task
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>

                  <button
                    onClick={(e) => handleDelete(internship._id, e)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    aria-label="Delete internship"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </IndustryLayout>
  )
}

export default InternshipDisplay

