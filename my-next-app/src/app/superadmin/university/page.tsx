"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Search, Plus, MapPin, Mail, Phone, User, Calendar, CheckCircle, X, ChevronDown } from "lucide-react"
import SuperAdminLayout from "../superadminlayout"

// Static university data
const universities = [
  {
    id: 1,
    name: "Air University",
    location: "Islamabad, Pakistan",
    established: "2002",
    type: "Public",
    website: "au.edu.pk",
    email: "info@au.edu.pk",
    phone: "+92-51-9262557",
    programs: "Engineering, Computer Science, Business",
    students: "5,000+",
  },
  {
    id: 2,
    name: "National University of Sciences & Technology",
    location: "Islamabad, Pakistan",
    established: "1991",
    type: "Public",
    website: "nust.edu.pk",
    email: "info@nust.edu.pk",
    phone: "+92-51-9085-1151",
    programs: "Engineering, Medicine, Business, Social Sciences",
    students: "15,000+",
  },
  {
    id: 3,
    name: "COMSATS University",
    location: "Islamabad, Pakistan",
    established: "1998",
    type: "Public",
    website: "comsats.edu.pk",
    email: "info@comsats.edu.pk",
    phone: "+92-51-9247000",
    programs: "Computer Science, Engineering, Business, Arts",
    students: "35,000+",
  },
  {
    id: 4,
    name: "Bahria University",
    location: "Islamabad, Pakistan",
    established: "2000",
    type: "Public",
    website: "bahria.edu.pk",
    email: "info@bahria.edu.pk",
    phone: "+92-51-9260002",
    programs: "Engineering, Management, Social Sciences",
    students: "9,000+",
  },
  {
    id: 5,
    name: "International Islamic University",
    location: "Islamabad, Pakistan",
    established: "1980",
    type: "Public",
    website: "iiu.edu.pk",
    email: "info@iiu.edu.pk",
    phone: "+92-51-9257988",
    programs: "Islamic Studies, Engineering, Social Sciences",
    students: "30,000+",
  },
  {
    id: 6,
    name: "Quaid-i-Azam University",
    location: "Islamabad, Pakistan",
    established: "1967",
    type: "Public",
    website: "qau.edu.pk",
    email: "info@qau.edu.pk",
    phone: "+92-51-9064000",
    programs: "Natural Sciences, Social Sciences, Medical",
    students: "13,000+",
  },
]

export default function UniversitiesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    established: "",
    type: "",
    website: "",
    email: "",
    phone: "",
    programs: "",
    contactPerson: "",
    additionalInfo: "",
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setTypeDropdownOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)

      // Reset form after showing success message
      setTimeout(() => {
        setSubmitted(false)
        setIsDialogOpen(false)
        setFormData({
          name: "",
          location: "",
          established: "",
          type: "",
          website: "",
          email: "",
          phone: "",
          programs: "",
          contactPerson: "",
          additionalInfo: "",
        })
      }, 2000)
    }, 1500)
  }

  const filteredUniversities = universities.filter(
    (university) =>
      university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      university.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      university.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <SuperAdminLayout>
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white py-12 px-4 md:px-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Universities Directory</h1>
                <p className="text-teal-100">Browse and manage university partnerships for internship programs</p>
              </div>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="mt-4 md:mt-0 bg-white text-teal-700 hover:bg-gray-100 px-4 py-2 rounded-md shadow-lg flex items-center"
              >
                <Plus className="mr-2 h-4 w-4" />
                Register New University
              </button>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUniversities.length > 0 ? (
                    filteredUniversities.map((university) => (
                      <tr key={university.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {university.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            {university.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{university.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{university.established}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{university.programs}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 text-gray-400 mr-1" />
                              {university.email}
                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 text-gray-400 mr-1" />
                              {university.phone}
                            </div>
                          </div>
                        </td>
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
                        <label htmlFor="established" className="block text-sm font-medium text-gray-700">
                          Established Year
                        </label>
                        <input
                          id="established"
                          name="established"
                          value={formData.established}
                          onChange={handleChange}
                          placeholder="e.g. 1990"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                          University Type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          >
                            {formData.type || "Select type"}
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          </button>
                          {typeDropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-200">
                              {["Public", "Private", "Semi-Government", "International"].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => handleSelectChange("type", type)}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                          Website
                        </label>
                        <input
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="e.g. university.edu"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Contact Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="contact@university.edu"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="e.g. +92-51-1234567"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                          Contact Person <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="contactPerson"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleChange}
                          placeholder="Name of primary contact"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="programs" className="block text-sm font-medium text-gray-700">
                        Programs Offered
                      </label>
                      <input
                        id="programs"
                        name="programs"
                        value={formData.programs}
                        onChange={handleChange}
                        placeholder="e.g. Engineering, Computer Science, Business"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
                        Additional Information
                      </label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        placeholder="Any additional details about the university..."
                        rows={3}
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
                          "Register University"
                        )}
                      </button>
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

