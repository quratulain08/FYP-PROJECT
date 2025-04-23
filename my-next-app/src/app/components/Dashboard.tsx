"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Line, Pie, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js"
import { FaGraduationCap, FaBriefcase, FaChartLine, FaChartPie, FaFilter } from "react-icons/fa"

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, BarElement, Title, Tooltip, Legend, ArcElement,Filler)

interface StudentData {
  name: string
  department: string
  batch: string
  didInternship: boolean
}

const StudentDashboard: React.FC = () => {
  const [students, setStudents] = useState<StudentData[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [selectedBatch, setSelectedBatch] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [departments, setDepartments] = useState<string[]>([])
  const [batches, setBatches] = useState<string[]>([])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)

        const email = localStorage.getItem("email")
        const response = await fetch(`/api/UniversityByEmailAdmin/${email}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        
       
  if (!response.ok) {
    throw new Error(`Failed to fetch university ID for ${email}`);
  }
  
  const dataa = await response.json();
  // Assuming the response is an object with the universityId property
  const universityId = dataa.universityId; // Access the correct property
        
        const res = await fetch(`/api/studentByUniversity/${universityId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }, // Missing comma here
        });
        
        
        const data = await res.json()
        setStudents(data)

        // Extract unique departments and batches
        const uniqueDepartments = Array.from(new Set(data.map((s: StudentData) => s.department)))
        const uniqueBatches = Array.from(new Set(data.map((s: StudentData) => s.batch)))

        setDepartments(uniqueDepartments as string[])
        setBatches(uniqueBatches as string[])
      } catch (error) {
        console.error("Failed to fetch students:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  // Filter logic based on selected department and batch
  const filteredStudents = students.filter(
    (student) =>
      (selectedDepartment ? student.department === selectedDepartment : true) &&
      (selectedBatch ? student.batch === selectedBatch : true),
  )

  // Get statistics for graphs
  const totalStudents = filteredStudents.length
  const studentsWithInternships = filteredStudents.filter((student) => student.didInternship).length

  const departmentCounts = filteredStudents.reduce<Record<string, number>>((acc, student) => {
    acc[student.department] = (acc[student.department] || 0) + 1
    return acc
  }, {})

  const batchCounts = filteredStudents.reduce<Record<string, { total: number; withInternship: number }>>(
    (acc, student) => {
      if (!acc[student.batch]) {
        acc[student.batch] = { total: 0, withInternship: 0 }
      }
      acc[student.batch].total += 1
      if (student.didInternship) {
        acc[student.batch].withInternship += 1
      }
      return acc
    },
    {},
  )

  // Data for Line Chart (Department-wise breakdown)
  const lineChartData = {
    labels: Object.keys(departmentCounts),
    datasets: [
      {
        label: "Students per Department",
        data: Object.values(departmentCounts),
        fill: true,
        backgroundColor: "rgba(46, 125, 50, 0.2)", // Light Green background
        borderColor: "rgba(46, 125, 50, 1)", // Green line color
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: "rgba(46, 125, 50, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(46, 125, 50, 1)",
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  }

  // Data for Pie Chart (Internships vs. No Internships)
  const pieChartData = {
    labels: ["With Internship", "Without Internship"],
    datasets: [
      {
        data: [studentsWithInternships, totalStudents - studentsWithInternships],
        backgroundColor: ["#4caf50", "#ff5252"], // Green and Red
        hoverBackgroundColor: ["#388e3c", "#d32f2f"],
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  }

  // Data for Bar Chart (Batch-wise internship status)
  const barChartData = {
    labels: Object.keys(batchCounts),
    datasets: [
      {
        label: "Total Students",
        data: Object.values(batchCounts).map((v) => v.total),
        backgroundColor: "rgba(33, 150, 243, 0.7)",
        borderColor: "rgba(33, 150, 243, 1)",
        borderWidth: 1,
      },
      {
        label: "With Internship",
        data: Object.values(batchCounts).map((v) => v.withInternship),
        backgroundColor: "rgba(76, 175, 80, 0.7)",
        borderColor: "rgba(76, 175, 80, 1)",
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          size: 14,
          family: "'Inter', sans-serif",
          weight: "bold",
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif",
        },
        padding: 12,
        cornerRadius: 6,
        displayColors: true,
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            <span className="text-green-600">Student</span> Dashboard
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaGraduationCap className="text-gray-400" />
              </div>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
              >
                <option value="">All Batches</option>
                {batches.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FaGraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FaBriefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">With Internship</p>
                <p className="text-2xl font-semibold text-gray-900">{studentsWithInternships}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <FaBriefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Without Internship</p>
                <p className="text-2xl font-semibold text-gray-900">{totalStudents - studentsWithInternships}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-green-500 mr-2 h-5 w-5" />
              <h2 className="text-xl font-bold text-gray-800">Department-wise Breakdown</h2>
            </div>
            <div className="h-80">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <FaChartPie className="text-green-500 mr-2 h-5 w-5" />
              <h2 className="text-xl font-bold text-gray-800">Internship Status</h2>
            </div>
            <div className="h-80">
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        
      </div>
    </div>
  )
}

export default StudentDashboard

