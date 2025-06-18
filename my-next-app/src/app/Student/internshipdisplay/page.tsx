"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, Calendar, MapPin, Building, ChevronRight } from "lucide-react"
import StudentLayout from "../StudentLayout"
import { useForm } from "react-hook-form"
import { Dialog } from "@headlessui/react"

interface PopupFormData {
  cgpa: number
  cv: FileList
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
  assignedStudents: string
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
interface Announcement {
  _id: string;
  title: string;
  content: string;
  expiresAt: string;
  isActive: boolean;

  // Add any other fields your announcement has
}

const InternshipDisplay = () => {
  const [internship, setInternship] = useState<Internship | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  // const [student, setStudent] = useState<Student | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)
const [showPopup, setShowPopup] = useState(false)
const [studentId, setStudentId] = useState<string | null>(null)
const { register, handleSubmit, reset } = useForm<PopupFormData>()
const [email, setemail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchAnnouncements()
    fetchInternships()
  }, [])

  const fetchInternships = async () => {
          const email = localStorage.getItem("email");

    //const email = "ammar33@gmail.com"; // Replace with actual logic to get the email
  setemail(email);
    try {
      setLoading(true)
      // Fetch student data by email
      const studentResponse = await fetch(`/api/StudentByemail/${email}`)
      if (!studentResponse.ok) throw new Error("Failed to fetch student details")

      const studentData = await studentResponse.json()
      // setStudent(studentData)

      if (!studentData || !studentData._id) {
        throw new Error("No student found with the provided email")
      }
         if (!studentData.cgpa || !studentData.cv) {
      setShowPopup(true)
    }


      const studentId = studentData._id

      // Fetch internships by assigned student ID
      const response = await fetch(`/api/InternshipsByAssignedStudents/${studentId}`)
      if (!response.ok) throw new Error("Failed to fetch internships")

      const data = await response.json()
      setInternship(data)
    } catch (err) {
      console.error(err)
      setError("Error fetching internships.")
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = (id: string) => {
    router.push(`/Student/taskdisplay/${id}`)
  }

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
      return new Date(dateString).toLocaleDateString(undefined, options)
    } catch (e) {
      return dateString
    }
  }

  const getCategoryLabel = (categoryValue: string) => {
    const categories = [
      { value: "frontend", label: "Frontend Development" },
      { value: "backend", label: "Backend Development" },
      { value: "fullstack", label: "Full Stack Development" },
      { value: "mobile", label: "Mobile Development" },
      { value: "data", label: "Data Science" },
      { value: "ai", label: "Artificial Intelligence" },
      // Add more categories as needed
    ]

    const category = categories.find((c) => c.value === categoryValue)
    return category ? category.label : categoryValue
  }


const fetchAnnouncements = async () => {
  try {

    const email = localStorage.getItem("email");
    const studentResponse = await fetch(`/api/StudentByemail/${email}`)
    if (!studentResponse.ok) throw new Error("Failed to fetch student details")

    const studentData = await studentResponse.json()
    // setStudent(studentData)

    if (!studentData || !studentData._id) {
      throw new Error("No student found with the provided email")
    }

    const uniId = studentData.university;

   

    const res = await fetch(`/api/Announcements/${uniId}`);
    const data: Announcement[] = await res.json();
    const now = new Date();

    const data2 = data.filter(
      (a) => a.isActive && (!a.expiresAt || new Date(a.expiresAt) > now)
    );

    setAnnouncements(data2)
  } catch (e) {
    console.error(e)
  } finally {
    setLoadingAnnouncements(false)
  }
}

  if (loading)
    return (
      <StudentLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </div>
      </StudentLayout>
    )

  if (error )
    return (
      <StudentLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>{error}</p>
          </div>
        </div>
      </StudentLayout>
    )

  return (
    <StudentLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
        <div className="mt-10">
  <h2 className="text-2xl font-semibold text-green-600 mb-4">Announcements</h2>
  {loadingAnnouncements ? (
    <p>Loading announcements...</p>
  ) : announcements.length === 0 ? (
    <p>No announcements available.</p>
  ) : (
    <ul className="space-y-4">
      {announcements.map((a) => (
        <li key={a._id} className="p-4 bg-white border rounded shadow hover:shadow-lg cursor-pointer" onClick={() => router.push(`/Student/announcement/${a._id}`)}>
          <h3 className="text-lg font-bold">{a.title}</h3>
          <p className="text-gray-600 line-clamp-2">{a.content}</p>
          <p className="text-sm text-gray-400 mt-1">Expires at: {new Date(a.expiresAt).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  )}
</div>
          <h1 className="text-3xl font-bold text-green-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
            My Internship
          </h1>
        </div>

        {!internship ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
            <Briefcase className="mx-auto h-16 w-16 text-gray-400 mb-2" />
            <h3
              className="mt-4 text-xl font-medium text-gray-900"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              No internship assigned
            </h3>
            <p className="mt-2 text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              You have not been assigned to any internship yet.
            </p>
          </div>
        ) : (
          <div
            onClick={() => handleCardClick(internship._id)}
            className="bg-white border border-gray-200 hover:border-green-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2
                  className="text-2xl font-semibold text-gray-800"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {internship.title}
                </h2>
                <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  {getCategoryLabel(internship.category)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Building className="h-5 w-5 mr-3 text-green-600 flex-shrink-0" />
                    <div>
                      <p
                        className="font-medium text-gray-700"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        Host Institution
                      </p>
                      <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        {internship.hostInstitution}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3 text-green-600 flex-shrink-0" />
                    <div>
                      <p
                        className="font-medium text-gray-700"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        Location
                      </p>
                      <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        {internship.location === "onsite"
                          ? "On-site"
                          : internship.location === "oncampus"
                            ? "On-campus"
                            : internship.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-3 text-green-600 flex-shrink-0" />
                    <div>
                      <p
                        className="font-medium text-gray-700"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        Duration
                      </p>
                      <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        {formatDate(internship.startDate)} - {formatDate(internship.endDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3
                  className="text-md font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Description
                </h3>
                <p className="text-gray-600 line-clamp-3" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                  {internship.description}
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-4 flex justify-between items-center border-t border-green-100">
              <div
                className="flex items-center text-green-600 font-medium"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                View Tasks & Details
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
              <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">Active</div>
            </div>
          </div>
        )}

        {showPopup && (
  <Dialog open={showPopup} onClose={() => {}} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <Dialog.Panel className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <Dialog.Title className="text-xl font-bold mb-4">Complete Your Profile</Dialog.Title>
      <form
     onSubmit={handleSubmit(async (data) => {
  const formData = new FormData()
  formData.append("cgpa", String(data.cgpa))
  formData.append("cv", data.cv[0]) // ✅ Correct reference to the uploaded file
  formData.append("email", email)

  const res = await fetch(`/api/update-cv-cgpa`, {
    method: "POST",
    body: formData,
  })

          if (res.ok) {
            setShowPopup(false)
            reset()
            fetchInternships()
          } else {
            alert("Failed to update profile.")
          }
        })}
        className="space-y-4"
      >
        <div>
          <label className="block font-medium mb-1">CGPA</label>
          <input
            type="number"
            step="0.01"
            {...register("cgpa", { required: true, min: 0, max: 4 })}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Upload CV (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            {...register("cv", { required: true })}
            className="border p-2 w-full rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Submit
        </button>
      </form>
    </Dialog.Panel>
  </Dialog>
)}

      </div>
    </StudentLayout>
  )
}

export default InternshipDisplay

