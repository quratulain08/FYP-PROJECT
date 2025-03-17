"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, FileText, User, Calendar, ChevronRight } from "lucide-react"
import StudentLayout from "../../StudentLayout"

interface Task {
  _id?: string
  title: string
  description: string
  deadline: string
  marks: number
  weightage: number
  assignedStudents: string[]
}

interface Internship {
  _id: string
  title: string
  hostInstitution: string
  location: string
  category: string
  startDate: string
  endDate: string
  description: string
  assignedFaculty: string
  assignedStudents: string[]
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

const TaskDisplay = () => {
  const params = useParams()
  const router = useRouter()
  const internshipId = params?.slug as string

  const [internship, setInternship] = useState<Internship | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [industryTasks, setIndustryTasks] = useState<Task[]>([])
  const [facultyTasks, setFacultyTasks] = useState<Task[]>([])
  const [studentId, setStudentId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"industry" | "faculty" | "students">("industry")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch student ID
        const email = "ammary9290111@gmail.com" // Replace with actual logic to get the email
        const studentResponse = await fetch(`/api/StudentByemail/${email}`)
        if (!studentResponse.ok) throw new Error("Failed to fetch student details")

        const studentData = await studentResponse.json()
        if (!studentData || !studentData._id) {
          throw new Error("No student found with the provided email")
        }

        setStudentId(studentData._id)

        // Fetch internship details
        const internshipResponse = await fetch(`/api/internships/${internshipId}`)
        if (!internshipResponse.ok) throw new Error("Failed to fetch internship details")

        const internshipData = await internshipResponse.json()
        setInternship(internshipData)

        // Fetch assigned students
        if (internshipData.assignedStudents && internshipData.assignedStudents.length > 0) {
          await fetchStudents(internshipData.assignedStudents)
        }

        // Fetch tasks
        await fetchTasks()
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (internshipId) {
      fetchData()
    }
  }, [internshipId])

  const fetchStudents = async (assignedStudents: string[]) => {
    try {
      const studentPromises = assignedStudents.map(async (studentId) => {
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

  const fetchTasks = async () => {
    try {
      // Fetch industry tasks
      const industryResponse = await fetch(`/api/tasksForIndustry/${internshipId}`)
      if (industryResponse.ok) {
        const industryData = await industryResponse.json()
        setIndustryTasks(industryData)
      }

      // Fetch faculty tasks
      const facultyResponse = await fetch(`/api/taskForFaculty/${internshipId}`)
      if (facultyResponse.ok) {
        const facultyData = await facultyResponse.json()
        setFacultyTasks(facultyData)
      }
    } catch (err) {
      console.error("Error fetching tasks:", err)
    }
  }

  const handleTaskClick = (taskId: string) => {
    router.push(`/Student/tasksubmission/${taskId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const email = "ammar33@gmail.com"; // Replace with actual logic to get the email

      setLoading(true); // Set loading to true before fetching data
      try {
       // Fetch student data by email
      const responsee = await fetch(`/api/StudentByemail/${email}`);
      if (!responsee.ok) throw new Error("Failed to fetch student details");
  
      const dataa = await responsee.json();
      setStudents(dataa);
  
      if (dataa.length === 0) {
        throw new Error("No students found with the provided email");
      }
  
      const adminid = dataa._id; // // Assuming you want the first student in the array
        setAdminId(adminid); // Set the adminId state

        // Fetch tasks and assigned students if activeTab and slug are valid
        if (activeTab === "internship" && slug) {
          await fetchTasks();
          await FetchAssignedStudent();
        }
      } catch (err: unknown) {
        console.log(err);
        setError("Error fetching internships.");
      } finally {
        setLoading(false); // Ensure loading is stopped in all cases
      }
    };

    fetchData(); // Call the async function
  }, [activeTab, slug]); // Dependencies

  return (
    <StudentLayout>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleGoBack}
          className="flex items-center text-green-600 hover:text-green-700 mb-6"
          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Internship
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
          <div className="bg-green-600 px-6 py-4">
            <h1
              className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              {internship.title}
            </h1>
            <p className="text-green-100 mt-1" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              {internship.hostInstitution}
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("industry")}
                className={`px-4 py-3 font-medium text-sm ${
                  activeTab === "industry"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Industry Tasks
              </button>
              <button
                onClick={() => setActiveTab("faculty")}
                className={`px-4 py-3 font-medium text-sm ${
                  activeTab === "faculty"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Faculty Tasks
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`px-4 py-3 font-medium text-sm ${
                  activeTab === "students"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Fellow Students
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Industry Tasks Tab */}
            {activeTab === "industry" && (
              <div>
                <h2
                  className="text-xl font-semibold mb-4 text-green-600"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Tasks Assigned by Industry Supervisor
                </h2>

                {industryTasks.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3
                      className="mt-4 text-lg font-medium text-gray-900"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      No tasks assigned yet
                    </h3>
                    <p
                      className="mt-2 text-sm text-gray-500"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      Your industry supervisor hasn't assigned any tasks yet
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {industryTasks
                      .filter((task) => task.assignedStudents.includes(studentId!))
                      .map((task) => (
                        <div
                          key={task._id}
                          onClick={() => handleTaskClick(task._id!)}
                          className="bg-white border border-gray-200 hover:border-green-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
                        >
                          <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                              <h3
                                className="text-lg font-semibold text-gray-800"
                                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                              >
                                {task.title}
                              </h3>
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                {task.marks} marks
                              </span>
                            </div>

                            <p
                              className="text-gray-600 mb-4 line-clamp-2"
                              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                            >
                              {task.description}
                            </p>

                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-2 text-green-600" />
                              <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                                Due: {formatDate(task.deadline)}
                              </span>
                            </div>
                          </div>
                          <div className="bg-green-50 p-3 border-t border-green-100">
                            <div className="flex items-center justify-between">
                              <span
                                className="text-sm font-medium text-green-600"
                                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                              >
                                View Task Details
                              </span>
                              <ChevronRight className="h-4 w-4 text-green-600" />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Faculty Tasks Tab */}
            {activeTab === "faculty" && (
              <div>
                <h2
                  className="text-xl font-semibold mb-4 text-green-600"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Tasks Assigned by Faculty Supervisor
                </h2>

                {facultyTasks.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3
                      className="mt-4 text-lg font-medium text-gray-900"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      No tasks assigned yet
                    </h3>
                    <p
                      className="mt-2 text-sm text-gray-500"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      Your faculty supervisor hasn't assigned any tasks yet
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {facultyTasks
                      .filter((task) => task.assignedStudents.includes(studentId!))
                      .map((task) => (
                        <div
                          key={task._id}
                          onClick={() => handleTaskClick(task._id!)}
                          className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md cursor-pointer transition-all duration-200"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3
                              className="font-medium text-green-600"
                              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                            >
                              {task.title}
                            </h3>
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              {task.marks} marks
                            </span>
                          </div>

                          <p
                            className="text-gray-600 text-sm mb-3 line-clamp-2"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            {task.description}
                          </p>

                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1 text-green-600" />
                            <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                              Due: {formatDate(task.deadline)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Students Tab */}
            {activeTab === "students" && (
              <div>
                <h2
                  className="text-xl font-semibold mb-4 text-green-600"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Fellow Students
                </h2>

                {students.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <h3
                      className="mt-4 text-lg font-medium text-gray-900"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      No students enrolled
                    </h3>
                    <p
                      className="mt-2 text-sm text-gray-500"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      This internship doesn't have any other students assigned yet
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {students.map((student) => (
                      <div
                        key={student._id}
                        className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                            <span
                              className="text-green-600 font-semibold text-lg"
                              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                            >
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <h3
                              className="text-base font-medium text-gray-900"
                              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                            >
                              {student.name}
                            </h3>
                            <p
                              className="text-sm text-gray-500"
                              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                            >
                              {student.registrationNumber}
                            </p>
                            <div className="mt-1 flex items-center">
                              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                              <p
                                className="text-xs text-gray-500"
                                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                              >
                                {student.department} - {student.batch} ({student.section})
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}

export default TaskDisplay

