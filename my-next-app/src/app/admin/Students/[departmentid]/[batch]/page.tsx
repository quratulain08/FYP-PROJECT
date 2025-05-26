"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import * as XLSX from "xlsx"
import { Edit, Mail, Trash2, Upload, ChevronRight, Users, CheckCircle, XCircle } from "lucide-react"
import Layout from "@/app/components/Layout"

interface Student {
  _id: string
  name: string
  department: string
  batch: string
  didInternship: boolean
  registrationNumber: string
  section: string
  email: string
  university:string
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
  const [department, setDepartment] = useState<Department | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [universityId, setUniversityId] = useState(''); // State to store universityId

  const params = useParams()
  const router = useRouter()
  const departmentId = params.departmentid as string
  const currentBatch = params.batch as string

  useEffect(() => {
       fetchStudents()
  }, [departmentId])


  const fetchStudents = async () => {
    try {
           const email = localStorage.getItem("email")
           const response = await fetch(`/api/UniversityByEmailAdmin/${email}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          
         
    if (!response.ok) {
      throw new Error(`Failed to fetch university ID for ${email}`);
    }
    
    const dataa= await response.json();
    // Assuming the response is an object with the universityId property
    const universityId = dataa.universityId; // Access the correct property
    setUniversityId(universityId); // Set the universityId in state

          const res = await fetch(`/api/studentByUniversity/${universityId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }, // Missing comma here
          });
          
      if (!res.ok) throw new Error("Failed to fetch data")
      const data: Student[] = await res.json()

      const ress = await fetch(`/api/department/${departmentId}`)
      if (!ress.ok) throw new Error("Failed to fetch department data")
      const departmentData: Department = await ress.json()
      setDepartment(departmentData)

      const filteredByDepartment = data.filter((student) =>
      Array.isArray(student.department) && student.department.includes(departmentData._id)
    );
          setStudents(filteredByDepartment)
      setFilteredStudents(filteredByDepartment)

      const uniqueSections = Array.from(new Set(filteredByDepartment.map((student) => student.section)))
      // Extract unique batches for filter options
      const uniqueBatches = Array.from(new Set(filteredByDepartment.map((student) => student.batch)))
      setBatches(uniqueBatches)
      batches
      setSections(uniqueSections) // Set sections for filter
    } catch (err) {
      setError(`Error fetching data ${departmentId}`)
    } finally {
      setLoading(false)
    }
  }
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

  const deleteStudent = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await fetch(`/api/students`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })
        if (response.ok) {
          setStudents((prev) => prev.filter((student) => student._id !== id))
          setFilteredStudents((prev) => prev.filter((student) => student._id !== id))
        } else {
          console.error("Failed to delete student")
        }
      } catch (error) {
        console.error("Error deleting student:", error)
      }
    }
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
      const batch = currentBatch
      const departmentName = department?._id || "Unknown Department"
      await handleFileUpload(file, batch, departmentName,universityId )
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload data.")
    } finally {
      setUploading(false)
    }
  }

  const sendMailToAll = async () => {
    if (window.confirm("Are you sure you want to send emails to all students in this batch?")) {
      const studentsInSelectedBatch = filteredStudents.filter((student) => student.batch === currentBatch)

      for (const student of studentsInSelectedBatch) {
        const email = student.email

        if (email) {
          try {
            const generateRandomPassword = () => {
              return Math.random().toString(36).slice(-8)
            }

            const StudentPassword = generateRandomPassword()

            const facultyResponse = await fetch("/api/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email,
                password: StudentPassword,
                role: "Student",
              }),
            })

            if (!facultyResponse.ok) {
              throw new Error("Error registering Student Person")
            }
            console.log("Student Person registered")

            const emailResponse = await fetch("/api/sendEmail-Student", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                StudentEmail: email,
                StudentPassword: StudentPassword,
              }),
            })

            if (!emailResponse.ok) {
              throw new Error("Error sending email")
            }
            console.log("Emails sent successfully")
          } catch (error) {
            console.error(error.message)
          }
        }
      }
      alert("Emails sent successfully!")
    }
  }

  const handleFileUpload = async (file: File, batch: string, department: string, university: string ) => {
    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: "array" })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData: Student[] = XLSX.utils.sheet_to_json(worksheet)

      const studentsWithBatch = jsonData.map((student) => ({
        ...student,
        batch,
        department,
        university
      }))

      if (!file || studentsWithBatch.length === 0) {
        alert("Please provide a valid file and batch information.")
        return
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("students", JSON.stringify(studentsWithBatch))

      const response = await fetch("/api/upload-students", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        console.error(`Failed to upload students: ${error.error}`)
        alert(`Failed to upload students: ${error.error}`)
        return
      }

      alert("Data uploaded successfully.")
      setShowModal(false)

      // Refresh the student list
      fetchStudents();

    
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload data.")
    }
  }

  // Get initials from student name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

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

  const studentsInCurrentBatch = filteredStudents.filter((student) => student.batch === currentBatch)

  // Calculate summary statistics
  const totalStudents = studentsInCurrentBatch.length
  const completedInternships = studentsInCurrentBatch.filter((student) => student.didInternship).length
  const pendingInternships = totalStudents - completedInternships
  const uniqueSectionsCount = new Set(studentsInCurrentBatch.map((student) => student.section)).size

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span
            className="hover:text-gray-700 cursor-pointer"
            onClick={() => router.push(`/admin/Batch/${departmentId}`)}
          >
            Batches
          </span>
          <ChevronRight className="mx-2 h-4 w-4" />
          <span className="font-medium text-green-600">{currentBatch}</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            {department?.name} - {currentBatch} Students
          </h1>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowModal(true)}
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
          </div>
        </div>

        {/* Stats Overview */}
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
                <Users className="h-6 w-6" />
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

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Students List</h3>
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
                    Reg. No
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Section
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Batch
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Internship
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
                          <button className="text-green-500 hover:text-green-700" title="Edit Student">
                            <Edit className="w-5 h-5" />
                          </button>
                      
                          <button
                            onClick={() => deleteStudent(student._id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete Student"
                          >
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
                onClick={() => setShowModal(false)}
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
    </Layout>
  )
}

export default StudentsPage

