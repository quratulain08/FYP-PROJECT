"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, BookOpen, Users, CheckCircle, ChevronRight, Upload, X } from "lucide-react"
import FocalPersonLayout from "../FocalPersonLayout"
import * as XLSX from "xlsx"

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
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [departmentId, setDepartmentId] = useState(null);

  const router = useRouter()

  const handleViewDetails = (batch: string) => {
    router.push(`/FocalPerson/students/${batch}`)
  }

  const fetchBatchData = async () => {
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
      const departmentId = dataa.departmentId;
      setDepartmentId(departmentId);


      const response2 = await fetch(`/api/UniversityByEmailAdmin/${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
     
if (!response2.ok) {
  throw new Error(`Failed to fetch university ID for ${email}`);
}

const data = await response2.json();
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

      const departmentStudents = students.filter((student) => student.department === department.name)

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
    } 
    // catch (err) {
    //   setError("Error fetching batch data.")
    // } 
    finally {
      setLoading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an Excel file.")
      return
    }

    setUploading(true)

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: "array" })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("students", JSON.stringify(jsonData))

      const response = await fetch("/api/upload-students", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.text()
        console.error("Upload failed:", error)
        alert("Upload failed. Check the console for details.")
        return
      }

      alert("Data uploaded successfully!")
      setShowModal(false)
      fetchBatchData() // Refresh data
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("An error occurred while uploading the file.")
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    fetchBatchData()
  }, [departmentId])

  if (loading)
    return (
      <FocalPersonLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </FocalPersonLayout>
    )

  if (error)
    return (
      <FocalPersonLayout>
        <div className="flex justify-center items-center h-screen">
          <div
            className="bg-red-50 text-red-600 p-4 rounded-lg"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
            {error}
          </div>
        </div>
      </FocalPersonLayout>
    )

  return (
    <FocalPersonLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>Departments</span>
          <ChevronRight className="mx-2 h-4 w-4" />
          <span className="font-medium text-blue-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
            {department?.name}
          </span>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
            {department?.name} - Batch Summary
          </h1>
{/* 
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
            <Upload className="w-4 h-4 mr-2" />
            Add Students
          </button> */}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p
                  className="text-sm font-medium text-gray-600"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Total Batches
                </p>
                <p
                  className="text-2xl font-semibold text-gray-900"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {batches.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p
                  className="text-sm font-medium text-gray-600"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Total Students
                </p>
                <p
                  className="text-2xl font-semibold text-gray-900"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {batches.reduce((sum, batch) => sum + batch.total, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p
                  className="text-sm font-medium text-gray-600"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Completed Internships
                </p>
                <p
                  className="text-2xl font-semibold text-gray-900"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {batches.reduce((sum, batch) => sum + batch.didInternship, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Batch Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3
              className="text-lg font-medium text-gray-900"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Batch Summary
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      No batches available
                    </td>
                  </tr>
                ) : (
                  batches.map((batch) => (
                    <tr key={batch.batch} className="hover:bg-gray-50">
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        {batch.batch}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        {batch.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          {batch.didInternship}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            batch.missingInternship > 0 ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"
                          }`}
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          {batch.missingInternship}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        {batch.totalSections}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(batch.batch)}
                          className="flex items-center text-blue-600 hover:text-blue-900 font-medium"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Students Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2
                className="text-xl font-semibold text-gray-900"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Upload Student Data
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Upload an Excel file containing student information. The file should include columns for name,
                registration number, batch, section, and internship status.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <span
                    className="text-sm font-medium text-gray-700"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Click to select a file
                  </span>
                  <span
                    className="text-xs text-gray-500 mt-1"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Excel files only (.xls, .xlsx)
                  </span>
                </label>
              </div>

              {file && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-md">
                      <FileIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p
                        className="text-sm font-medium text-gray-900"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setFile(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`px-4 py-2 rounded-md text-white ${
                  !file || uploading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                {uploading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⟳</span>
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </FocalPersonLayout>
  )
}

// Simple file icon component
const FileIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
)

export default BatchSummary

