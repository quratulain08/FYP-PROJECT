"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import * as XLSX from "xlsx"
import { Users, CheckCircle, XCircle,
  //  Upload, Mail,
    LayoutGrid } from "lucide-react"
import FocalPersonLayout from "../../FocalPersonLayout"

interface Student {
  _id: string
  name: string
  department: string
  batch: string
  didInternship: boolean
  registrationNumber: string
  section: string
  email: string
}

interface Department {
  _id: string
  name: string
  startDate: string
  category: string
  hodName: string
  honorific: string
  cnic: string
  email: string
  phone: string
  landLine?: string
  address: string
  province: string
  city: string
}

const FilterSelect = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) => (
  <div className="flex items-center space-x-2">
    <label htmlFor={label} className="text-sm font-medium text-gray-700">
      {label}:
    </label>
    <select
      id={label}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
    >
      <option value="All">All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
)

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [selectedInternshipStatus, setSelectedInternshipStatus] = useState<string>("All")
  const [batches, setBatches] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedSection, setSelectedSection] = useState<string>("All")
  const [error, setError] = useState<string | null>(null)
  const [sections, setSections] = useState<string[]>([])
  const DepartmentID = "674179f1d751474776dc5bd5"
  const [department, setDepartment] = useState<Department | null>(null)
  const params = useParams()
  const batch = params.slug as string
  const router = useRouter()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/students")
        if (!res.ok) throw new Error("Failed to fetch data")
        const data: Student[] = await res.json()

        const ress = await fetch(`/api/department/${DepartmentID}`)
        if (!ress.ok) throw new Error("Failed to fetch department data")
        const departmentData: Department = await ress.json()
        setDepartment(departmentData)

        const filteredByDepartment = data.filter((student) => student.department === departmentData.name)
        setStudents(filteredByDepartment)
        setFilteredStudents(filteredByDepartment)

        const uniqueSections = Array.from(new Set(filteredByDepartment.map((student) => student.section)))
        const uniqueBatches = Array.from(new Set(filteredByDepartment.map((student) => student.batch)))
        setBatches(uniqueBatches)
        setSections(uniqueSections)
      } catch (err) {
        setError(`Error fetching data: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [DepartmentID])

  useEffect(() => {
    let filtered = students

    if (selectedInternshipStatus !== "All") {
      const didInternship = selectedInternshipStatus === "Yes"
      filtered = filtered.filter((student) => student.didInternship === didInternship)
    }

    if (selectedSection !== "All") {
      filtered = filtered.filter((student) => student.section === selectedSection)
    }

    setFilteredStudents(filtered)
  }, [selectedInternshipStatus, selectedSection, students])

  const handleAddInternship = async (id: string) => {
    router.push(`/FocalPerson/InternshipsForStudent/${id}`)
  }

  // const openUploadModal = () => {
  //   setShowModal(true)
  // }

  const closeModal = () => {
    setShowModal(false)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.")
      return
    }

    setUploading(true)
    try {
      // Parse the Excel file to JSON
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: "array" })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      // Prepare form data to send with file
      const formData = new FormData()
      formData.append("file", file)
      formData.append("students", JSON.stringify(jsonData))

      // Upload the formData
      const response = await fetch("/api/upload-students", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to upload students")
      }

      alert("Data uploaded successfully.")
      setShowModal(false)

      // Refresh the student list
      const res = await fetch("/api/students")
      if (res.ok) {
        const data: Student[] = await res.json()
        const filteredByDepartment = data.filter((student) => student.department === department?.name)
        setStudents(filteredByDepartment)
        setFilteredStudents(filteredByDepartment)
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert(`Failed to upload data: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setUploading(false)
    }
  }

  // const sendMailToAll = async () => {
  //   if (window.confirm("Are you sure you want to send emails to all students in this batch?")) {
  //     const studentsInSelectedBatch = filteredStudents.filter((student) => student.batch === batch)

  //     for (const student of studentsInSelectedBatch) {
  //       const email = student.email

  //       if (email) {
  //         try {
  //           const generateRandomPassword = () => {
  //             return Math.random().toString(36).slice(-8)
  //           }

  //           const StudentPassword = generateRandomPassword()

  //           const studentResponse = await fetch("/api/register", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               email: email,
  //               password: StudentPassword,
  //               role: "Student",
  //             }),
  //           })

  //           if (!studentResponse.ok) {
  //             throw new Error("Error registering Student")
  //           }

  //           const emailResponse = await fetch("/api/sendEmail-Student", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               StudentEmail: email,
  //               StudentPassword: StudentPassword,
  //             }),
  //           })

  //           if (!emailResponse.ok) {
  //             throw new Error("Error sending email")
  //           }
  //         } catch (error) {
  //           console.error(error instanceof Error ? error.message : String(error))
  //         }
  //       }
  //     }
  //     alert("Emails sent successfully!")
  //   }
  // }

  // Get initials from student name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    )
  }

  const studentsInCurrentBatch = filteredStudents.filter((student) => student.batch === batch)

  // Calculate summary statistics
  const totalStudents = studentsInCurrentBatch.length
  const completedInternships = studentsInCurrentBatch.filter((student) => student.didInternship).length
  const pendingInternships = totalStudents - completedInternships
  const uniqueSectionsCount = new Set(studentsInCurrentBatch.map((student) => student.section)).size

  return (
    <FocalPersonLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {department?.name} - {batch} Students
          </h1>

          {/* <div className="flex space-x-3">
            <button
              onClick={openUploadModal}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Students
            </button>
            <button
              onClick={sendMailToAll}
              className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Mail to All
            </button>
          </div> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <p className="text-2xl font-semibold text-gray-900">{completedInternships}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Internships</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingInternships}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <LayoutGrid className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sections</p>
                <p className="text-2xl font-semibold text-gray-900">{uniqueSectionsCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4">
          <FilterSelect
            label="Internship Status"
            value={selectedInternshipStatus}
            options={["Yes", "No"]}
            onChange={(e) => setSelectedInternshipStatus(e.target.value)}
          />

          {sections.length > 0 && (
            <FilterSelect
              label="Section"
              value={selectedSection}
              options={sections}
              onChange={(e) => setSelectedSection(e.target.value)}
            />
          )}
        </div>

        {/* Students List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Students List</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reg. No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Section
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Internship
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentsInCurrentBatch.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No students available
                    </td>
                  </tr>
                ) : (
                  studentsInCurrentBatch.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">{getInitials(student.name)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.registrationNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.section}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.batch}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.didInternship ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.didInternship ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          {!student.didInternship ? (
                            <button
                              onClick={() => handleAddInternship(student._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Add To Internship
                            </button>
                          ) : (
                            <span className="text-gray-500">Internship Done</span>
                          )}
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

      {/* Upload Students Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Students Data</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Excel File (.xlsx, .xls)</label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="mt-1 text-xs text-gray-500">Upload an Excel file containing student information</p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </FocalPersonLayout>
  )
}

export default StudentsPage

