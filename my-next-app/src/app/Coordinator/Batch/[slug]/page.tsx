"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Eye, Edit, Mail, Trash2, Plus, BookOpen, Users, CheckCircle, ChevronRight } from "lucide-react"
import Layout from "@/app/Coordinator/CoordinatorLayout"

interface Student {
  _id: string
  name: string
  department: string
  batch: string
  didInternship: boolean
  registrationNumber: string
  section: string
}

interface Batch {
  batch: string
  total: number
  didInternship: number
  missingInternship: number
  totalSections: number
}

interface Department {
  _id: string
  name: string
}

const BatchSummary: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([])
  const [department, setDepartment] = useState<Department | null>(null)
  const [newBatchName, setNewBatchName] = useState<string>("")
  const [showAddBatchModal, setShowAddBatchModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const params = useParams()
  const departmentId = params.slug as string

  const handleViewDetails = (batch: string) => {
    router.push(`/admin/Students/${departmentId}/${batch}`)
  }

  const fetchBatchData = async () => {
    try {

      const email = localStorage.getItem("email")
      const response = await fetch(`/api/UniversityByEmailAdmin/${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
     
if (!response.ok) {
  throw new Error(`Failed to fetch university ID for ${email}`);
}

const data = await response.json();
// Assuming the response is an object with the universityId property
const universityId = data.universityId; // Access the correct property
      
      const res = await fetch(`/api/studentByUniversity/${universityId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }, // Missing comma here
      });
      
      if (!res.ok) throw new Error("Failed to fetch students")

      const students: Student[] = await res.json()

      const departmentRes = await fetch(`/api/department/${departmentId}`)
      if (!departmentRes.ok) throw new Error("Failed to fetch department")

      const department = await departmentRes.json()
      setDepartment(department)

      const departmentStudents = students.filter(
        (student) => Array.isArray(student.department) && student.department.includes(department._id)
      );
      

      const batchSummary = departmentStudents.reduce(
        (acc, student) => {
          const batchData = acc.find((item) => item.batch === student.batch)
          if (batchData) {
            batchData.total++
            if (student.didInternship) batchData.didInternship++
            if (!batchData.sections.includes(student.section)) {
              batchData.sections.push(student.section)
            }
          } else {
            acc.push({
              batch: student.batch,
              total: 1,
              didInternship: student.didInternship ? 1 : 0,
              sections: [student.section],
            })
          }
          return acc
        },
        [] as { batch: string; total: number; didInternship: number; sections: string[] }[],
      )

      setBatches(
        batchSummary.map((batch) => ({
          batch: batch.batch,
          total: batch.total,
          didInternship: batch.didInternship,
          missingInternship: batch.total - batch.didInternship,
          totalSections: batch.sections.length,
        })),
      )
    } catch (err) {
      setError("Error fetching batch data.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddBatch = async () => {
    if (!newBatchName.trim()) {
      alert("Batch name cannot be empty.")
      return
    }

    try {
      const response = await fetch("/api/Batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batchName: newBatchName,
          departmentId: departmentId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to add batch")
      }

      // Add the new batch to the table if the API call is successful
      setBatches((prevBatches) => [
        ...prevBatches,
        {
          batch: newBatchName,
          total: 0,
          didInternship: 0,
          missingInternship: 0,
          totalSections: 0,
        },
      ])

      // Reset modal state
      setNewBatchName("")
      setShowAddBatchModal(false)
    } catch (error) {
      console.error("Error adding batch:", error)
      alert("Error adding batch. Please try again.")
    }
  }

  useEffect(() => {
    fetchBatchData()
  }, [departmentId])

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )

  // Calculate summary statistics
  const totalStudents = batches.reduce((sum, batch) => sum + batch.total, 0)
  const totalCompletedInternships = batches.reduce((sum, batch) => sum + batch.didInternship, 0)
  const totalMissingInternships = batches.reduce((sum, batch) => sum + batch.missingInternship, 0)

  return (
    <Layout>
     <div className="max-w-7xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="hover:text-gray-700 cursor-pointer" onClick={() => router.push("/admin/Department")}>
            Departments
          </span>
          <ChevronRight className="mx-2 h-4 w-4" />
          <span className="font-medium text-green-600">{department?.name}</span>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">{department?.name} - Batch Summary</h1>

          <button
            onClick={() => setShowAddBatchModal(true)}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Batch
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Batches</p>
                <p className="text-2xl font-semibold text-gray-900">{batches.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Internships</p>
                <p className="text-2xl font-semibold text-gray-900">{totalCompletedInternships}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Missing Internships</p>
                <p className="text-2xl font-semibold text-gray-900">{totalMissingInternships}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Batch Summary</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Students
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Completed Internship
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Missing Internship
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Sections
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No batches available
                    </td>
                  </tr>
                ) : (
                  batches.map((batch) => (
                    <tr key={batch.batch} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{batch.batch}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {batch.didInternship}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            batch.missingInternship > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {batch.missingInternship}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.totalSections}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleViewDetails(batch.batch)}
                            className="text-blue-500 hover:text-blue-700"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="text-green-500 hover:text-green-700" title="Edit Batch">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="text-indigo-500 hover:text-indigo-700" title="Send Email">
                            <Mail className="w-5 h-5" />
                          </button>
                          <button className="text-red-500 hover:text-red-700" title="Delete Batch">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Batch Modal */}
      {showAddBatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Batch</h2>

            <div className="mb-4">
              <label htmlFor="batchName" className="block text-sm font-medium text-gray-700 mb-1">
                Batch Name
              </label>
              <input
                id="batchName"
                type="text"
                placeholder="Enter batch name"
                value={newBatchName}
                onChange={(e) => setNewBatchName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddBatchModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBatch}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default BatchSummary

