"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Award, FileText, User, CheckCircle, Download } from "lucide-react"
import FacultyLayout from "../../FacultyLayout"

interface Submission {
  _id: string
  studentName: string
  fileUrl: string
  grade?: number
  submittedAt: string
}

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

const TaskDetails = () => {
  const params = useParams()
  const router = useRouter()
  const taskId = params?.slug as string

  const [task, setTask] = useState<any>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingGrades, setSavingGrades] = useState(false)

  const fetchTaskDetails = async () => {
    if (!taskId) {
      setError("Task ID not provided.")
      setLoading(false)
      return
    }

    try {
      // Fetch task details
      const response = await fetch(`/api/task/${taskId}`)
      if (!response.ok) throw new Error("Failed to fetch task details")

      const data = await response.json()
      setTask(data)

      // Fetch submissions
      const submissionsResponse = await fetch(`/api/submission/${taskId}`)
      if (submissionsResponse.ok) {
        const submissionsData = await submissionsResponse.json()
        console.log("Fetched submissions:", submissionsData)
        setSubmissions(submissionsData)
      } else {
        console.error("Failed to fetch submissions")
      }

      // Fetch internship details to get assigned students
      if (data.internshipId) {
        const internshipResponse = await fetch(`/api/internships/${data.internshipId}`)
        if (internshipResponse.ok) {
          const internshipData = await internshipResponse.json()

          if (internshipData.assignedStudents && internshipData.assignedStudents.length > 0) {
            await fetchStudents(internshipData.assignedStudents)
          }
        }
      }
    } catch (err) {
      console.error("Error fetching task details:", err)
      setError(err instanceof Error ? err.message : "Failed to load task details.")
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async (studentIds: string[]) => {
    try {
      const studentPromises = studentIds.map(async (studentId) => {
        const response = await fetch(`/api/students/${studentId}`)
        if (!response.ok) throw new Error(`Failed to fetch student with ID ${studentId}`)
        return await response.json()
      })

      const studentsData = await Promise.all(studentPromises)
      setStudents(studentsData)
    } catch (err) {
      console.error("Error fetching students:", err)
    }
  }

  const handleGradeChange = (submissionId: string, grade: number) => {
    setSubmissions((prevSubmissions) =>
      prevSubmissions.map((submission) => (submission._id === submissionId ? { ...submission, grade } : submission)),
    )
  }

  const handleSaveGrades = async () => {
    try {
      setSavingGrades(true)

      const updatePromises = submissions.map((submission) =>
        fetch(`/api/submission/${submission._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ grade: submission.grade }),
        }),
      )

      const responses = await Promise.all(updatePromises)
      const failedResponses = responses.filter((response) => !response.ok)

      if (failedResponses.length > 0) {
        alert("Some grades failed to save. Please try again.")
        return
      }

      alert("Grades saved successfully!")
    } catch (err) {
      console.error("Error saving grades:", err)
      alert("An error occurred while saving grades.")
    } finally {
      setSavingGrades(false)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  useEffect(() => {
    fetchTaskDetails()
  }, [taskId])

  if (loading) {
    return (
      <FacultyLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </div>
      </FacultyLayout>
    )
  }

  if (error || !task) {
    return (
      <FacultyLayout>
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
      </FacultyLayout>
    )
  }

  return (
    <FacultyLayout>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleGoBack}
          className="flex items-center text-green-600 hover:text-green-700 mb-6"
          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
          {/* Task Header */}
          <div className="bg-green-600 px-6 py-4">
            <h1
              className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              {task.title || "Untitled Task"}
            </h1>
          </div>

          {/* Task Details */}
          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-700 mb-4" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                {task.description || "No description available."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-600" />
                  <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    <strong>Deadline:</strong>{" "}
                    {task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline"}
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

            {/* Submissions Section */}
            <div className="mt-8">
              <h2
                className="text-xl font-semibold text-gray-800 mb-4"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Student Submissions
              </h2>

              {submissions.length === 0 ? (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
                  <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    No submissions yet
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Student
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Submitted At
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          File
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Grade
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {submissions.map((submission) => (
                        <tr key={submission._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <User className="h-5 w-5 text-gray-400 mr-3" />
                              <span
                                className="text-sm font-medium text-gray-900"
                                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                              >
                                {submission.studentName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className="text-sm text-gray-500"
                              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                            >
                              {new Date(submission.submittedAt).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <a
                              href={submission.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-green-600 hover:text-green-800"
                              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              View Submission
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <input
                                type="number"
                                min="0"
                                max={task.marks}
                                value={submission.grade || ""}
                                onChange={(e) => handleGradeChange(submission._id, Number.parseInt(e.target.value))}
                                className="w-16 p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                              />
                              <span
                                className="ml-2 text-sm text-gray-500"
                                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                              >
                                / {task.marks}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {submissions.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSaveGrades}
                    disabled={savingGrades}
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 disabled:bg-green-400 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    {savingGrades ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Save Grades
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Assigned Students Section */}
            {students.length > 0 && (
              <div className="mt-8">
                <h2
                  className="text-xl font-semibold text-gray-800 mb-4"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Assigned Students
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((student) => (
                    <div key={student._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <span
                            className="text-green-600 font-medium"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <h3
                            className="text-sm font-medium text-gray-900"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            {student.name}
                          </h3>
                          <p
                            className="text-xs text-gray-500"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            {student.registrationNumber}
                          </p>
                          <p
                            className="text-xs text-gray-500"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            {student.department} - {student.batch} ({student.section})
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FacultyLayout>
  )
}

export default TaskDetails

