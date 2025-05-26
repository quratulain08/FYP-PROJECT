"use client"

import type React from "react"

import { FaTrash, FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaTag } from "react-icons/fa"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Internship {
  _id: string
  title: string
  hostInstitution: string
  location: string
  category: string
  startDate: string
  endDate: string
  description: string
}

const Internships: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  // const router = useRouter()

  useEffect(() => {
    fetchInternships()
  }, [])

  const fetchInternships = async () => {
    try {
           const CoordinatorEmail = localStorage.getItem("email") || "default@example.com"; 
            const res = await fetch(`/api/departmentByemail/${CoordinatorEmail}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });


            if (!res.ok) {
              throw new Error(`Failed to fetch university ID for ${CoordinatorEmail}`);
            }
            
            const dataa= await res.json();
            // Assuming the response is an object with the universityId property
            const departmentId = dataa.departmentId;
            
          
      const response = await fetch(`/api/internshipByDepartment/${departmentId}`)
      if (!response.ok) throw new Error("Failed to fetch internships")

      const data = await response.json()
      setInternships(data)
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

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    )

  return (
    <div className="bg-gray-50  py-0">
      if(err){}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="text-green-600">Available</span> Internships
          </h1>
        </div>

        {internships.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">No internships available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {internships.map((internship) => (
    <div
      key={internship._id}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="border-l-4 border-green-500 p-6">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{internship.title}</h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(internship._id);
            }}
            className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
            title="Delete Internship"
          >
            <FaTrash size={18} />
          </button>
        </div>

        <div className="flex items-center text-green-600 mb-4">
          <FaBuilding className="mr-2" />
          <span className="font-medium">{internship.hostInstitution}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="text-gray-500 mr-2" />
              <span>{internship.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaTag className="text-gray-500 mr-2" />
              <span>{internship.category}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <span>
                {formatDate(internship.startDate)} - {formatDate(internship.endDate)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="font-medium text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600">{internship.description}</p>
        </div>
      </div>
    </div>
  ))}
</div>

        )}
      </div>
    </div>
  )
}

export default Internships

