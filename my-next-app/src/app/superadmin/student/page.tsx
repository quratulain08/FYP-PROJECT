"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users, GraduationCap, Briefcase, Building, Award, Clock, LogIn, X } from "lucide-react"
import SuperAdminLayout from "../SuperAdminLayout"

export default function StudentPage() {
  const router = useRouter()
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, this would validate credentials and redirect
      alert("Login functionality would be implemented here")

      setSubmitting(false)
      setIsLoginDialogOpen(false)
      setLoginData({
        email: "",
        password: "",
      })
    } catch (error) {
      console.error("Error:", error)
      setSubmitting(false)
    }
  }

  return (
    <SuperAdminLayout>
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white py-12 px-4 md:px-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Student Portal</h1>
                <p className="text-teal-100">Access internship opportunities and track your progress</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => setIsLoginDialogOpen(true)}
                  className="bg-white text-teal-700 hover:bg-gray-100 px-4 py-2 rounded-md shadow-lg flex items-center"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Student Login
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 md:px-8 -mt-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registered Students</p>
                  <p className="text-2xl font-bold text-gray-800">5,200+</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <Briefcase className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Internships Completed</p>
                  <p className="text-2xl font-bold text-gray-800">3,750+</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <Building className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Partner Companies</p>
                  <p className="text-2xl font-bold text-gray-800">120+</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <Award className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Job Placements</p>
                  <p className="text-2xl font-bold text-gray-800">1,850+</p>
                </div>
              </div>
            </div>
          </div>

          {/* Internship Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <GraduationCap className="mr-2 h-5 w-5 text-teal-600" />
                Internship Statistics by Department
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Computer Science</span>
                    <span className="text-sm font-medium text-gray-700">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Electrical Engineering</span>
                    <span className="text-sm font-medium text-gray-700">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Mechanical Engineering</span>
                    <span className="text-sm font-medium text-gray-700">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Business Administration</span>
                    <span className="text-sm font-medium text-gray-700">70%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: "70%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Social Sciences</span>
                    <span className="text-sm font-medium text-gray-700">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-teal-600" />
                Internship Completion Timeline
              </h2>
              <div className="space-y-6">
                <div className="relative pl-8 pb-6 border-l-2 border-teal-500">
                  <div className="absolute -left-2 top-0 w-5 h-5 rounded-full bg-teal-500"></div>
                  <h3 className="text-lg font-medium text-gray-800">Summer 2023</h3>
                  <p className="text-gray-600">1,250 students completed internships</p>
                  <p className="text-sm text-gray-500 mt-1">92% satisfaction rate</p>
                </div>
                <div className="relative pl-8 pb-6 border-l-2 border-teal-500">
                  <div className="absolute -left-2 top-0 w-5 h-5 rounded-full bg-teal-500"></div>
                  <h3 className="text-lg font-medium text-gray-800">Winter 2022-23</h3>
                  <p className="text-gray-600">850 students completed internships</p>
                  <p className="text-sm text-gray-500 mt-1">88% satisfaction rate</p>
                </div>
                <div className="relative pl-8 pb-6 border-l-2 border-teal-500">
                  <div className="absolute -left-2 top-0 w-5 h-5 rounded-full bg-teal-500"></div>
                  <h3 className="text-lg font-medium text-gray-800">Summer 2022</h3>
                  <p className="text-gray-600">1,100 students completed internships</p>
                  <p className="text-sm text-gray-500 mt-1">90% satisfaction rate</p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute -left-2 top-0 w-5 h-5 rounded-full bg-teal-500"></div>
                  <h3 className="text-lg font-medium text-gray-800">Winter 2021-22</h3>
                  <p className="text-gray-600">750 students completed internships</p>
                  <p className="text-sm text-gray-500 mt-1">85% satisfaction rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Opportunities
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-teal-600" />
              Featured Internship Opportunities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-gray-800">Software Development Intern</h3>
                <p className="text-sm text-gray-500 mb-2">Tech Solutions Inc.</p>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock className="h-4 w-4 mr-1" />6 months
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Gain hands-on experience in full-stack development with modern technologies.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">Remote</span>
                  <button
                    className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                    onClick={() => setIsLoginDialogOpen(true)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-gray-800">Data Analysis Intern</h3>
                <p className="text-sm text-gray-500 mb-2">Global Finance Group</p>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock className="h-4 w-4 mr-1" />3 months
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Work with financial data and develop analytical skills in a corporate environment.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">On-site</span>
                  <button
                    className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                    onClick={() => setIsLoginDialogOpen(true)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-gray-800">Marketing Assistant</h3>
                <p className="text-sm text-gray-500 mb-2">Telecom Networks</p>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock className="h-4 w-4 mr-1" />4 months
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Support digital marketing campaigns and learn about customer acquisition strategies.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">Hybrid</span>
                  <button
                    className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                    onClick={() => setIsLoginDialogOpen(true)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        </div>

        {/* Login Dialog */}
        {isLoginDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-[400px]">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-teal-700">Student Login</h2>
                  <button onClick={() => setIsLoginDialogOpen(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Student Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      placeholder="student@university.edu"
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
