"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"
import FocalPersonLayout from "../FocalPersonLayout"
import { Briefcase, Users, BookOpen, AlertCircle } from "lucide-react"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

interface Internship {
  _id: string
  title: string
  hostInstitution: string
  location: string
  category: string
  startDate: string
  endDate: string
  description: string
  assignedFaculty: string[]
  assignedStudents: string[]
}

const Dashboard: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
 s // const [universityId, setUniversityId] = useState(null);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) return;

        const response = await fetch(`/api/departmentByfocalperson/${email}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch department ID for ${email}`);
        }

        const dataa= await response.json();
        // Assuming the response is an object with the universityId property
        const departmentId = dataa._id;
        
        const res = await fetch(`/api/internshipByDepartment/${departmentId}`)
        if (!res.ok) throw new Error("Failed to fetch internships")
        const data: Internship[] = await res.json()
        setInternships(data)
      } catch (err) {
        setError("Error fetching internships")
      } finally {
        setLoading(false)
      }
    }
    fetchInternships()
  }, [])

  if (loading) {
    return (
      <FocalPersonLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p
              className="text-gray-600 font-medium text-sm"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Loading dashboard data...
            </p>
          </div>
        </div>
      </FocalPersonLayout>
    )
  }

  if (error) {
    return (
      <FocalPersonLayout>
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3
                className="text-base font-semibold text-red-700 mb-1"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Error Loading Dashboard
              </h3>
              <p className="text-red-600 text-sm" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </FocalPersonLayout>
    )
  }

  // Calculate Missing Assignments
  const missingStudents = internships.filter((i) => i.assignedStudents.length === 0).length
  const missingFaculty = internships.filter((i) => i.assignedFaculty.length === 0).length

  // Data for Pie Chart (Assigned Students vs Faculty)
  const studentFacultyCounts = internships.reduce(
    (acc, i) => {
      acc.students += i.assignedStudents.length
      acc.faculty += i.assignedFaculty.length
      return acc
    },
    { students: 0, faculty: 0 },
  )

  const pieData = {
    labels: ["Assigned Students", "Assigned Faculty"],
    datasets: [
      {
        data: [studentFacultyCounts.students, studentFacultyCounts.faculty],
        backgroundColor: ["#3b82f6", "#f97316"], // Blue and orange
        hoverBackgroundColor: ["#2563eb", "#ea580c"],
        borderWidth: 0,
      },
    ],
  }

  // Data for Bar Chart (Internships by Category)
  const categories = Array.from(new Set(internships.map((i) => i.category)))
  const categoryCounts = categories.map((category) => internships.filter((i) => i.category === category).length)

  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Internships by Category",
        data: categoryCounts,
        backgroundColor: "#f97316", // Orange
        borderColor: "#ea580c",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 11,
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          font: {
            size: 10,
          },
        },
      },
    },
  }

  const pieOptions = {
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            size: 11,
          },
        },
      },
    },
    cutout: "50%",
  }

  return (
    <FocalPersonLayout>
      if(err){}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1
            className="text-2xl font-bold text-gray-800 mb-2 md:mb-0"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
            Internship Dashboard
          </h1>
          <div className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 text-sm">
            <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p
                  className="text-xs text-gray-500 font-medium mb-1"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Total Internships
                </p>
                <h2
                  className="text-xl font-bold text-gray-800"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {internships.length}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-lg mr-3">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p
                  className="text-xs text-gray-500 font-medium mb-1"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Missing Students
                </p>
                <h2
                  className="text-xl font-bold text-gray-800"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {missingStudents}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-indigo-500">
            <div className="flex items-start">
              <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                <BookOpen className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p
                  className="text-xs text-gray-500 font-medium mb-1"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Missing Faculty
                </p>
                <h2
                  className="text-xl font-bold text-gray-800"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {missingFaculty}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
            <h2
              className="text-base font-semibold text-gray-700 mb-4"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Assigned Students vs Faculty
            </h2>
            <div className="relative">
              <Pie data={pieData} options={pieOptions} />
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span
                  className="text-2xl font-bold text-gray-800"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {studentFacultyCounts.students + studentFacultyCounts.faculty}
                </span>
                <span className="text-xs text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                  Total Assigned
                </span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
            <h2
              className="text-base font-semibold text-gray-700 mb-4"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Internships by Category
            </h2>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Summary Table */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-5 border border-gray-200">
          <h2
            className="text-base font-semibold text-gray-700 mb-3"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
            Assignment Summary
          </h2>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    With Students
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    With Faculty
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category, index) => {
                  const categoryInternships = internships.filter((i) => i.category === category)
                  const withStudents = categoryInternships.filter((i) => i.assignedStudents.length > 0).length
                  const withFaculty = categoryInternships.filter((i) => i.assignedFaculty.length > 0).length

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td
                        className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-900"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        {category}
                      </td>
                      <td
                        className="px-4 py-2 whitespace-nowrap text-xs text-gray-500"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        {categoryInternships.length}
                      </td>
                      <td
                        className="px-4 py-2 whitespace-nowrap"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {withStudents}
                        </span>
                      </td>
                      <td
                        className="px-4 py-2 whitespace-nowrap"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                          {withFaculty}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FocalPersonLayout>
  )
}

export default Dashboard

