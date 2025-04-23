"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Building, Search, Plus, MapPin, Mail, Briefcase, User, Calendar, CheckCircle, X, LogIn } from 'lucide-react'
import SuperAdminLayout from "../SuperAdminLayout"

interface Industry {
  id: string
  name: string
  sector: string
  location: string
  contactEmail: string
  employeeCount: string
}

export default function IndustryPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [industries, setIndustries] = useState<Industry[]>([
    { 
      id: "1", 
      name: "Tech Solutions Inc.", 
      sector: "Information Technology", 
      location: "Islamabad", 
      contactEmail: "contact@techsolutions.com",
      employeeCount: "500+"
    },
    { 
      id: "2", 
      name: "Global Finance Group", 
      sector: "Banking & Finance", 
      location: "Karachi", 
      contactEmail: "info@globalfinance.com",
      employeeCount: "1200+"
    },
    { 
      id: "3", 
      name: "MediCare Systems", 
      sector: "Healthcare", 
      location: "Lahore", 
      contactEmail: "support@medicare.org",
      employeeCount: "350+"
    },
    { 
      id: "4", 
      name: "EnergyTech Pakistan", 
      sector: "Energy", 
      location: "Islamabad", 
      contactEmail: "info@energytech.pk",
      employeeCount: "750+"
    },
    { 
      id: "5", 
      name: "Telecom Networks", 
      sector: "Telecommunications", 
      location: "Rawalpindi", 
      contactEmail: "contact@telecomnetworks.com",
      employeeCount: "900+"
    }
  ])
  
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    location: '',
    contactEmail: '',
    contactPerson: '',
    phoneNumber: '',
    website: '',
    description: ''
  })
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
  
    try {
      const response = await fetch("/api/industryToAddEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      // Add new industry to the list (in a real app, this would come from the API)
      const newIndustry = {
        id: (industries.length + 1).toString(),
        name: formData.name,
        sector: formData.sector,
        location: formData.location,
        contactEmail: formData.contactEmail,
        employeeCount: "N/A"
      }
      
      setIndustries(prev => [...prev, newIndustry])
      setSubmitting(false)
      setSubmitted(true)
  
      setTimeout(() => {
        setSubmitted(false)
        setIsDialogOpen(false)
        setFormData({
          name: '',
          sector: '',
          location: '',
          contactEmail: '',
          contactPerson: '',
          phoneNumber: '',
          website: '',
          description: ''
        })
      }, 2000)
    } catch (error) {
      console.error("Error:", error)
      setSubmitting(false)
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
  
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, this would validate credentials and redirect
      alert("Login functionality would be implemented here")
      
      setSubmitting(false)
      setIsLoginDialogOpen(false)
      setLoginData({
        email: '',
        password: ''
      })
    } catch (error) {
      console.error("Error:", error)
      setSubmitting(false)
    }
  }

  const filteredIndustries = industries.filter(
    (industry) =>
      industry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      industry.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      industry.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <SuperAdminLayout>
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white py-12 px-4 md:px-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Industry Partners</h1>
                <p className="text-teal-100">Connect with industry partners for internship and job opportunities</p>
              </div>
              <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-white text-teal-700 hover:bg-gray-100 px-4 py-2 rounded-md shadow-lg flex items-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Register Your Company
                </button>
                <button
                  onClick={() => setIsLoginDialogOpen(true)}
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
                <Building className="inline-block mr-2 h-5 w-5 text-teal-600" />
                Registered Industry Partners
              </h2>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Industries Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sector
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIndustries.length > 0 ? (
                    filteredIndustries.map((industry) => (
                      <tr key={industry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {industry.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 text-gray-400 mr-1" />
                            {industry.sector}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            {industry.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-1" />
                            {industry.contactEmail}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {industry.employeeCount}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No companies found matching your search criteria.
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
                  <Building className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Companies</p>
                  <p className="text-2xl font-bold text-gray-800">{industries.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <Briefcase className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Internships Offered</p>
                  <p className="text-2xl font-bold text-gray-800">250+</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <User className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Students Placed</p>
                  <p className="text-2xl font-bold text-gray-800">1,200+</p>
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

        {/* Registration Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-teal-700">Register Your Company</h2>
                  <button onClick={() => setIsDialogOpen(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {submitted ? (
                  <div className="bg-teal-50 border border-teal-200 text-teal-800 rounded-lg p-6 text-center my-4">
                    <CheckCircle className="h-12 w-12 mx-auto text-teal-500 mb-4" />
                    <h4 className="text-lg font-medium mb-2">Registration Successful!</h4>
                    <p>Your company has been registered successfully.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter company name"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="sector" className="block text-sm font-medium text-gray-700">
                          Industry Sector <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="sector"
                          name="sector"
                          value={formData.sector}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        >
                          <option value="">Select a sector</option>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Banking & Finance">Banking & Finance</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Energy">Energy</option>
                          <option value="Telecommunications">Telecommunications</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Education">Education</option>
                          <option value="Other">Other</option>
                        </select>
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
                        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                          Contact Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="contactEmail"
                          name="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={handleChange}
                          placeholder="contact@company.com"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                          Contact Person
                        </label>
                        <input
                          id="contactPerson"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleChange}
                          placeholder="Full name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="+92 XXX XXXXXXX"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Company Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Brief description of your company..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
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
                          "Register Company"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Login Dialog */}
        {isLoginDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-[400px]">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-teal-700">Industry Partner Login</h2>
                  <button onClick={() => setIsLoginDialogOpen(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      placeholder="contact@company.com"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="text-teal-600 hover:text-teal-500">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center justify-center"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  )
}
