"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Award, FileText, Upload, Check, Download } from "lucide-react"
import StudentLayout from "../../StudentLayout"

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

interface Submission {
  _id: string
  studentName: string
  fileUrl: string
  grade?: number
  submittedAt: string
}

const TaskSubmission = () => {
  const params = useParams()
  const router = useRouter()
  const taskId = params?.slug as string

  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [task, setTask] = useState<any>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        await Promise.all([fetchTaskDetails(), FetchStudentDetails()])
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (taskId) {
      fetchData()
    }
  }, [taskId])

  const fetchTaskDetails = async () => {
    try {
      const response = await fetch(`/api/task/${taskId}`)
      if (!response.ok) throw new Error("Failed to fetch task details")

      const data = await response.json()
      setTask(data)

      // Fetch submissions
      const submissionsResponse = await fetch(`/api/submission/${taskId}`)
      if (submissionsResponse.ok) {
        const submissionsData = await submissionsResponse.json()
        setSubmissions(submissionsData)
      }
    } catch (error) {
      console.error("Error fetching task details:", error)
      throw error
    }
  }

  const FetchStudentDetails = async () => {
    const email = "ammar33@gmail.com"; // Replace with actual logic to get the email
  
    try {
      // Fetch student data by email
      const response = await fetch(`/api/StudentByemail/${email}`)
      if (!response.ok) throw new Error("Failed to fetch student details")

      const data = await response.json()
      setStudent(data)

      if (!data) {
        throw new Error("No student found with the provided email")
      }
    } catch (err) {
      console.error("Error fetching student:", err)
      throw err
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.")
      return
    }

    setUploading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append("pdfStudent", file)

    try {
      const res = await fetch("/api/upload-PDFs", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload")
      }

      await handleSubmitFile(data.fileUrl || data.fileId)
      setMessage("File uploaded and submission recorded successfully!")
      setFile(null)

      // Refresh submissions
      await fetchTaskDetails()
    } catch (error: any) {
      setMessage(error.message || "Error uploading file")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmitFile = async (fileId: string) => {
    if (!student) {
      throw new Error("No student details available")
    }

    const response = await fetch(`/api/submission/${taskId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileId: fileId,
        studentName: student.name,
        studentId: student._id,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to record submission")
    }

    return await response.json()
  }

  const handleGoBack = () => {
    router.back()
  }

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
      return new Date(dateString).toLocaleDateString(undefined, options)
    } catch (e) {
      return dateString
    }
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </div>
      </StudentLayout>
    )
  }

  if (error || !task) {
    return (
      <StudentLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>{error || "Task not found"}</p>
          </div>
          <button
            onClick={handleGoBack}
            className="flex items-center text-green-600 hover:text-green-700"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </StudentLayout>
    )
  }

  // Filter submissions to only show this student's submissions
  const mySubmissions = student ? submissions.filter((s) => s.studentName === student.name) : []

  return (
    <StudentLayout>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleGoBack}
          className="flex items-center text-green-600 hover:text-green-700 mb-6"
          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tasks
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
          <div className="bg-green-600 px-6 py-4">
            <h1
              className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              {task.title || "Untitled Task"}
            </h1>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-700 mb-4" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                {task.description || "No description available."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-600" />
                  <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    <strong>Deadline:</strong> {task.deadline ? formatDate(task.deadline) : "No deadline"}
                  </span>
                </div>

                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-green-600" />
                  <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    <strong>Marks:</strong> {task.marks ?? "N/A"}
                  </span>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-600" />
                  <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    <strong>Weightage:</strong> {task.weightage ?? "N/A"}%
                  </span>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h2
                className="text-xl font-semibold text-gray-800 mb-4"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Submit Your Work
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-12 h-12 mb-3 text-gray-400" />
                      <p
                        className="mb-2 text-sm text-gray-500"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        PDF, DOCX, or other document formats (max 10MB)
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      name="pdfStudent"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {file && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-md mr-3">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p
                          className="font-medium text-gray-700"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          {file.name}
                        </p>
                        <p
                          className="text-xs text-gray-500"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-gray-500 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                      aria-label="Remove file"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className={`w-full flex items-center justify-center ${
                    !file || uploading ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  } text-white py-3 px-4 rounded-md transition-colors duration-200`}
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Submit Assignment
                    </>
                  )}
                </button>

                {message && (
                  <div
                    className={`p-4 rounded-lg ${message.includes("successfully") ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}
                  >
                    <div className="flex items-center">
                      {message.includes("successfully") ? (
                        <Check className="h-5 w-5 mr-2 text-green-600" />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-red-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <p style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>{message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submissions Section */}
            <div className="mt-8">
              <h2
                className="text-xl font-semibold text-gray-800 mb-4"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Your Submissions
              </h2>

              {mySubmissions.length === 0 ? (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
                  <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    You haven't submitted anything yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mySubmissions.map((submission, index) => (
                    <div
                      key={submission._id}
                      className="p-5 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center mb-2">
                            <div className="bg-green-100 h-8 w-8 rounded-full flex items-center justify-center mr-3">
                              <span className="text-green-600 font-bold">{index + 1}</span>
                            </div>
                            <h3
                              className="font-medium text-gray-800 text-lg"
                              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                            >
                              Submission {index + 1}
                            </h3>
                          </div>
                          <p
                            className="text-sm text-gray-500 mb-1"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            Submitted on {formatDate(submission.submittedAt)}
                          </p>
                          {submission.grade !== undefined ? (
                            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              <Award className="h-4 w-4 mr-1" />
                              Grade: {submission.grade} / {task.marks}
                            </div>
                          ) : (
                            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                              <Clock className="h-4 w-4 mr-1" />
                              Pending Review
                            </div>
                          )}
                        </div>
                        <a
                          href={submission.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 py-2 px-4 rounded-md transition-colors duration-200"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          View Submission
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}

export default TaskSubmission

