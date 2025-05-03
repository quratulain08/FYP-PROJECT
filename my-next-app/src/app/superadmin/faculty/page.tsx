"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users, BookOpen, Award, GraduationCap, Building2, LogIn, X } from "lucide-react"
import SuperAdminLayout from "../SuperAdminLayout"

export default function FacultyPage() {
  const router = useRouter()

  

  return (
    <SuperAdminLayout>
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white py-12 px-4 md:px-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Faculty Portal</h1>
                <p className="text-teal-100">Distinguished faculty members and academic resources</p>
              </div>
              <div className="mt-4 md:mt-0">
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
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Faculty</p>
                  <p className="text-2xl font-bold text-gray-800">350+</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <Award className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">PhD Faculty</p>
                  <p className="text-2xl font-bold text-gray-800">180+</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <BookOpen className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Research Publications</p>
                  <p className="text-2xl font-bold text-gray-800">2,500+</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <Building2 className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Departments</p>
                  <p className="text-2xl font-bold text-gray-800">15</p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Faculty */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Award className="mr-2 h-5 w-5 text-teal-600" />
              Distinguished Faculty Members
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200">
                  <img
                    src="/placeholder.svg?height=200&width=400"
                    alt="Dr. Ahmed Khan"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 text-lg">Dr. Ahmed Khan</h3>
                  <p className="text-sm text-teal-600 mb-2">Professor, Computer Science</p>
                  <p className="text-sm text-gray-600 mb-3">
                    PhD from MIT with over 20 years of experience in AI and Machine Learning research.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpen className="h-4 w-4 mr-1" />
                    120+ Publications
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200">
                  <img
                    src="/placeholder.svg?height=200&width=400"
                    alt="Dr. Fatima Zaidi"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 text-lg">Dr. Fatima Zaidi</h3>
                  <p className="text-sm text-teal-600 mb-2">Associate Professor, Electrical Engineering</p>
                  <p className="text-sm text-gray-600 mb-3">
                    PhD from Stanford University, specializing in renewable energy systems and smart grids.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpen className="h-4 w-4 mr-1" />
                    85+ Publications
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200">
                  <img
                    src="/placeholder.svg?height=200&width=400"
                    alt="Dr. Usman Ali"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 text-lg">Dr. Usman Ali</h3>
                  <p className="text-sm text-teal-600 mb-2">Professor, Business Administration</p>
                  <p className="text-sm text-gray-600 mb-3">
                    PhD from Harvard Business School with expertise in entrepreneurship and innovation management.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpen className="h-4 w-4 mr-1" />
                    95+ Publications
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Research Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-teal-600" />
                Research Highlights
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-teal-500 pl-4 py-2">
                  <h3 className="font-medium text-gray-800">Artificial Intelligence in Healthcare</h3>
                  <p className="text-sm text-gray-600">
                    Our faculty has pioneered research in applying AI for early disease detection and treatment
                    optimization.
                  </p>
                  <p className="text-xs text-teal-600 mt-1">15 publications in top-tier journals</p>
                </div>
                <div className="border-l-4 border-teal-500 pl-4 py-2">
                  <h3 className="font-medium text-gray-800">Sustainable Energy Solutions</h3>
                  <p className="text-sm text-gray-600">
                    Breakthrough research in renewable energy integration and smart grid technologies.
                  </p>
                  <p className="text-xs text-teal-600 mt-1">12 patents filed, 3 commercialized</p>
                </div>
                <div className="border-l-4 border-teal-500 pl-4 py-2">
                  <h3 className="font-medium text-gray-800">Blockchain for Supply Chain Management</h3>
                  <p className="text-sm text-gray-600">
                    Innovative applications of blockchain technology to enhance transparency and efficiency in supply
                    chains.
                  </p>
                  <p className="text-xs text-teal-600 mt-1">8 industry partnerships established</p>
                </div>
                <div className="border-l-4 border-teal-500 pl-4 py-2">
                  <h3 className="font-medium text-gray-800">Advanced Materials Science</h3>
                  <p className="text-sm text-gray-600">
                    Development of novel materials with applications in construction, healthcare, and electronics.
                  </p>
                  <p className="text-xs text-teal-600 mt-1">5 international research collaborations</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <GraduationCap className="mr-2 h-5 w-5 text-teal-600" />
                Academic Achievements
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-teal-100 p-2 rounded-full mr-3 mt-1">
                    <Award className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">National Research Excellence Award</h3>
                    <p className="text-sm text-gray-600">
                      Awarded to our Computer Science department for outstanding contributions to AI research.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-teal-100 p-2 rounded-full mr-3 mt-1">
                    <Award className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">International Teaching Innovation Prize</h3>
                    <p className="text-sm text-gray-600">
                      Recognized for pioneering new teaching methodologies in engineering education.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-teal-100 p-2 rounded-full mr-3 mt-1">
                    <Award className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Industry-Academia Partnership Award</h3>
                    <p className="text-sm text-gray-600">
                      For successful collaboration with leading technology companies on research projects.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-teal-100 p-2 rounded-full mr-3 mt-1">
                    <Award className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Global Sustainability Research Grant</h3>
                    <p className="text-sm text-gray-600">
                      $2.5 million grant awarded for research on sustainable urban development.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </SuperAdminLayout>
  )
}
