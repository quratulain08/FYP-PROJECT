"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"
import InterpriseCellLayout from "../InterpriseCellLayout"
import { Briefcase, Clock, CheckCircle, AlertCircle } from "lucide-react"

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
  isApproved: boolean
}

const ApprovalDashboard: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const email = localStorage.getItem("email")
      const res = await fetch(`/api/UniversityByEmailAdmin/${email}`, {
       method: "GET",
       headers: { "Content-Type": "application/json" },
     });
     
    
if (!res.ok) {
 throw new Error(`Failed to fetch university ID for ${email}`);
}

const dataa= await res.json();
// Assuming the response is an object with the universityId property
const universityId = dataa.universityId;

      const response = await fetch(`/api/internshipsByUniversity/${universityId}`)
      if (!response.ok) throw new Error("Failed to fetch internships")

        const data: Internship[] = await response.json()
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
      <InterpriseCellLayout>
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
      </InterpriseCellLayout>
    )
  }

  if (error) {
    return (
      <InterpriseCellLayout>
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
      </InterpriseCellLayout>
    )
  }

  // Calculate Approval Stats
  const pendingApproval = internships.filter((i) => !i.isApproved).length
  const approved = internships.filter((i) => i.isApproved).length
  const totalInternships = internships.length
  const approvalRate = totalInternships > 0 ? Math.round((approved / totalInternships) * 100) : 0

  // Data for Pie Chart (Approval Status)
  const approvalData = {
    labels: ["Approved", "Pending Approval"],
    datasets: [
      {
        data: [approved, pendingApproval],
        backgroundColor: ["#3b82f6", "#f97316"], // Blue and orange
        hoverBackgroundColor: ["#2563eb", "#ea580c"],
        borderWidth: 0,
      },
    ],
  }

  // Data for Bar Chart (Internships by Category with Approval Status)
  const categories = Array.from(new Set(internships.map((i) => i.category)))
  const categoryApprovalCounts = categories.map((category) => {
    const total = internships.filter((i) => i.category === category).length
    const approvedCount = internships.filter((i) => i.category === category && i.isApproved).length
    const pendingCount = total - approvedCount
    return { category, approvedCount, pendingCount }
  })

  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Approved",
        data: categoryApprovalCounts.map((c) => c.approvedCount),
        backgroundColor: "#3b82f6", // Blue
        borderRadius: 4,
      },
      {
        label: "Pending Approval",
        data: categoryApprovalCounts.map((c) => c.pendingCount),
        backgroundColor: "#f97316", // Orange
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
    <InterpriseCellLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1
            className="text-2xl font-bold text-gray-800 mb-2 md:mb-0"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
            Internship Approval Dashboard
          </h1>
          <div className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 text-sm">
            <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-gray-500">
            <div className="flex items-start">
              <div className="bg-gray-100 p-2 rounded-lg mr-3">
                <Briefcase className="h-5 w-5 text-gray-600" />
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
                  {totalInternships}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p
                  className="text-xs text-gray-500 font-medium mb-1"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Approved
                </p>
                <h2
                  className="text-xl font-bold text-gray-800"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {approved}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
            <div className="flex items-start">
              <div className="bg-orange-100 p-2 rounded-lg mr-3">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p
                  className="text-xs text-gray-500 font-medium mb-1"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Pending Approval
                </p>
                <h2
                  className="text-xl font-bold text-gray-800"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {pendingApproval}
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
              Approval Status
            </h2>
            <div className="relative">
              <Pie data={approvalData} options={pieOptions} />
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span
                  className="text-2xl font-bold text-gray-800"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {approvalRate}%
                </span>
                <span className="text-xs text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                  Approval Rate
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

        {/* Recent Activity */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-5 border border-gray-200">
          <h2
            className="text-base font-semibold text-gray-700 mb-3"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
            Approval Summary
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
                    Approved
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Pending
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoryApprovalCounts.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td
                      className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-900"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      {item.category}
                    </td>
                    <td
                      className="px-4 py-2 whitespace-nowrap text-xs text-gray-500"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      {item.approvedCount + item.pendingCount}
                    </td>
                    <td
                      className="px-4 py-2 whitespace-nowrap"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.approvedCount}
                      </span>
                    </td>
                    <td
                      className="px-4 py-2 whitespace-nowrap"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                        {item.pendingCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </InterpriseCellLayout>
  )
}

export default ApprovalDashboard

