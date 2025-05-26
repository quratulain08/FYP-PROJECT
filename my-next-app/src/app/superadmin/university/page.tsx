"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Building2, Search, Plus, MapPin, Mail,  User, Calendar, CheckCircle, X,LogIn } from "lucide-react"
import SuperAdminLayout from "../SuperAdminLayout"

interface University {
  _id: string
  name: string
  contactEmail: string
  location: string
}
// Static university data


export default function UniversitiesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [universities, setUniversities] = useState<University[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
   
  const [formData, setFormData] = useState({
    _id: '',
  name: '',
  contactEmail: '',
  location: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const fetchUniversities = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/universities")
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      setUniversities(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch universities")
    } finally {
      setLoading(false)
    }
  }
  

  useEffect(() => {
    fetchUniversities();
    
  },[])

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setTypeDropdownOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
  
    try {
      const response = await fetch("/api/universityToAddEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) throw new Error("Failed to send email");
  
      setSubmitting(false);
      setSubmitted(true);
  
      setTimeout(() => {
        setSubmitted(false);
        setIsDialogOpen(false);
        setFormData({ _id: "", name: "", contactEmail: "", location: "" });
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setSubmitting(false);
    }
  };

  const filteredUniversities = universities.filter(
    (university) =>
      university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      university.location.toLowerCase().includes(searchTerm.toLowerCase()) 
  )

  return (
    <SuperAdminLayout>
     
       <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Section */}
      <div className="bg-green-600 from-teal-700 to-teal-600 text-white py-12 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Universities Directory</h1>
              <p className="text-teal-100">Browse and manage university partnerships for internship programs</p>
            </div>
            <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
              <button
                onClick={() => setIsDialogOpen(true)}
                className="bg-white text-teal-700 hover:bg-gray-100 px-4 py-2 rounded-md shadow-lg flex items-center"
              >
                <Plus className="mr-2 h-4 w-4" />
                Register New University
              </button>
              <button
                onClick={() => router.push('/Login')}
                className="bg-white text-teal-700 hover:bg-gray-100 px-4 py-2 rounded-md shadow-lg flex items-center"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 md:px-8 -mt-6">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">
                <Building2 className="inline-block mr-2 h-5 w-5 text-teal-600" />
                Registered Universities
              </h2>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search universities..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Universities Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Established
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Programs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th> */}
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUniversities.length > 0 ? (
                    filteredUniversities.map((university) => (
                      <tr key={university._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {university.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            {university.location}
                          </div>
                        </td>
                        
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 text-gray-400 mr-1" />
                              {university.contactEmail}
                            </div>
                            
                          </div>
                        </td> */}
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            className="text-teal-600 border border-teal-200 hover:bg-teal-50 hover:text-teal-700 px-3 py-1 rounded-md text-sm"
                            onClick={() => router.push(`/universities/${university.id}`)}
                          >
                            View Details
                          </button>
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        No universities found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <Building2 className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Universities</p>
                  <p className="text-2xl font-bold text-gray-800">{universities.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Locations</p>
                  <p className="text-2xl font-bold text-gray-800">3</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <User className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Students Enrolled</p>
                  <p className="text-2xl font-bold text-gray-800">107,000+</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <Calendar className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-2xl font-bold text-gray-800">Today</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Dialog - Custom implementation without shadcn/ui */}
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-teal-700">Register New University</h2>
                  <button onClick={() => setIsDialogOpen(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {submitted ? (
                  <div className="bg-teal-50 border border-teal-200 text-teal-800 rounded-lg p-6 text-center my-4">
                    <CheckCircle className="h-12 w-12 mx-auto text-teal-500 mb-4" />
                    <h4 className="text-lg font-medium mb-2">Registration Successful!</h4>
                    <p>The university has been registered successfully.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          University Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter university name"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="City, Country"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>

                      

                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Contact Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          name="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={handleChange}
                          placeholder="contact@university.edu"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>


                  

                    <div className="flex justify-end gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsDialogOpen(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                            Registering...
                          </>
                        ) : (
                          "Request Register"
                        )}
                      </button>
                    </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  )
}

