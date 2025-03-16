"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Briefcase,
  Building,
  Mail,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  Share2,
  Printer,
  Download,
} from "lucide-react"
import IndustryLayout from "../../IndustryLayout"

interface Internship {
  _id: string
  title: string
  description: string
  startDate: string
  endDate: string
  category: string
  numberOfStudents: number
  location: "onsite" | "oncampus"
  compensationType: "paid" | "unpaid"
  compensationAmount?: number
  supervisorName: string
  supervisorEmail: string
  hostInstitution: string
  assignedStudents?: string[]
  assignedFaculty?: string
}

const InternshipDetails = () => {
  const params = useParams()
  const router = useRouter()
  const internshipId = params?.id as string

  const [internship, setInternship] = useState<Internship | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"details" | "requirements" | "contact">("details")

  useEffect(() => {
    const fetchInternshipDetails = async () => {
      if (!internshipId) return

      setLoading(true)
      try {
        console.log("Fetching internship with ID:", internshipId)
        const res = await fetch(`/api/internships/${internshipId}`)

        if (!res.ok) {
          const errorText = await res.text()
          console.error("API error response:", errorText)
          throw new Error(`Failed to fetch internship details: ${errorText}`)
        }

        const data = await res.json()
        console.log("Internship data received:", data)
        setInternship(data)
      } catch (err) {
        console.error("Error in fetch:", err)
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchInternshipDetails()
  }, [internshipId])

  const handleGoBack = () => {
    router.back()
  }

  const getCategoryLabel = (categoryValue: string) => {
    const categories = [
      { value: "frontend", label: "Frontend Development" },
      { value: "backend", label: "Backend Development" },
      { value: "fullstack", label: "Full Stack Development" },
      { value: "mobile", label: "Mobile Development" },
      { value: "data", label: "Data Science" },
      { value: "ai", label: "Artificial Intelligence" },
      { value: "cybersecurity", label: "Cybersecurity" },
      { value: "cloud", label: "Cloud Computing" },
      { value: "qa", label: "Quality Assurance" },
      { value: "accounting", label: "Accounting" },
      { value: "finance", label: "Finance" },
      { value: "marketing", label: "Marketing" },
      { value: "sales", label: "Sales" },
      { value: "hr", label: "Human Resources" },
      { value: "consulting", label: "Business Consulting" },
      { value: "mechanical", label: "Mechanical Engineering" },
      { value: "electrical", label: "Electrical Engineering" },
      { value: "civil", label: "Civil Engineering" },
      { value: "chemical", label: "Chemical Engineering" },
      { value: "aerospace", label: "Aerospace Engineering" },
      { value: "medical", label: "Medical" },
      { value: "nursing", label: "Nursing" },
      { value: "pharmacy", label: "Pharmacy" },
      { value: "biotech", label: "Biotechnology" },
      { value: "design", label: "Graphic Design" },
      { value: "content", label: "Content Writing" },
      { value: "media", label: "Digital Media" },
      { value: "ui_ux", label: "UI/UX Design" },
      { value: "research", label: "Research & Development" },
      { value: "physics", label: "Physics" },
      { value: "chemistry", label: "Chemistry" },
      { value: "biology", label: "Biology" },
      { value: "legal", label: "Legal" },
      { value: "public_policy", label: "Public Policy" },
      { value: "government", label: "Government" },
      { value: "teaching", label: "Teaching" },
      { value: "training", label: "Corporate Training" },
      { value: "education_tech", label: "Education Technology" },
      { value: "other", label: "Other" },
    ]

    const category = categories.find((c) => c.value === categoryValue)
    return category ? category.label : categoryValue
  }

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
      return new Date(dateString).toLocaleDateString(undefined, options)
    } catch (e) {
      console.error("Date formatting error:", e)
      return dateString
    }
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate)
      const end = new Date(endDate)

      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      const months = Math.floor(diffDays / 30)
      const days = diffDays % 30

      if (months > 0) {
        return `${months} month${months > 1 ? "s" : ""}${days > 0 ? ` and ${days} day${days > 1 ? "s" : ""}` : ""}`
      }
      return `${diffDays} day${diffDays > 1 ? "s" : ""}`
    } catch (e) {
      console.error("Duration calculation error:", e)
      return "Duration not available"
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <IndustryLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </div>
      </IndustryLayout>
    )
  }

  if (error || !internship) {
    return (
      <IndustryLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>{error || "Internship not found"}</p>
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
      </IndustryLayout>
    )
  }

  console.log("Rendering internship:", internship)

  return (
    <IndustryLayout>
      <div className="container mx-auto px-4 py-8 print:py-2">
        <div className="print:hidden">
          <button
            onClick={handleGoBack}
            className="flex items-center text-green-600 hover:text-green-700 mb-6"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Internships
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 print:shadow-none print:border-none">
          {/* Header */}
          <div className="bg-green-600 px-6 py-4 print:bg-white print:border-b-2 print:border-green-600">
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-block px-3 py-1 bg-white text-green-800 rounded-full text-sm font-medium mb-2 print:border print:border-green-600 print:text-green-600">
                  {getCategoryLabel(internship.category)}
                </div>
                <h1
                  className="text-2xl md:text-3xl font-bold text-white print:text-green-600"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {internship.title}
                </h1>
                <p
                  className="text-green-100 mt-1 print:text-gray-600"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {internship.hostInstitution}
                </p>
              </div>

              <div className="flex space-x-2 print:hidden">
                <button
                  onClick={handlePrint}
                  className="p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-colors"
                  title="Print"
                >
                  <Printer className="h-5 w-5" />
                </button>
                <button
                  className="p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-colors"
                  title="Share"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs - Desktop */}
          <div className="border-b border-gray-200 print:hidden">
            <div className="flex">
              <button
                onClick={() => setActiveTab("details")}
                className={`px-4 py-3 font-medium text-sm ${
                  activeTab === "details"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("requirements")}
                className={`px-4 py-3 font-medium text-sm ${
                  activeTab === "requirements"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Requirements
              </button>
              <button
                onClick={() => setActiveTab("contact")}
                className={`px-4 py-3 font-medium text-sm ${
                  activeTab === "contact"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                Contact
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Key Information - Always visible */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 print:grid-cols-3">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-3 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    Duration
                  </p>
                  <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    {formatDate(internship.startDate)} - {formatDate(internship.endDate)}
                  </p>
                  <p className="text-sm text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    ({calculateDuration(internship.startDate, internship.endDate)})
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
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

              <div className="flex items-start">
                <DollarSign className="h-5 w-5 mr-3 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    Compensation
                  </p>
                  <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    {internship.compensationType === "paid"
                      ? `Paid - $${internship.compensationAmount || "Not specified"}`
                      : "Unpaid"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="print:block">
              {/* Details Tab */}
              {(activeTab === "details" || true) && (
                <div className={activeTab !== "details" ? "hidden print:block" : ""}>
                  <h2
                    className="text-xl font-semibold text-gray-800 mb-3 print:text-green-600"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    About This Internship
                  </h2>
                  <div className="prose max-w-none mb-6">
                    <p
                      className="text-gray-700 whitespace-pre-line"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      {internship.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3
                        className="text-lg font-semibold text-gray-800 mb-3"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        Key Details
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <Briefcase className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                          <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                            <strong>Category:</strong> {getCategoryLabel(internship.category)}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <User className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                          <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                            <strong>Positions:</strong> {internship.numberOfStudents}{" "}
                            {internship.numberOfStudents === 1 ? "student" : "students"}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Building className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                          <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                            <strong>Host Institution:</strong> {internship.hostInstitution}
                          </span>
                        </li>
                        {internship.assignedFaculty && (
                          <li className="flex items-start">
                            <User className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                            <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                              <strong>Faculty Supervisor:</strong> {internship.assignedFaculty}
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h3
                        className="text-lg font-semibold text-gray-800 mb-3"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        Status
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <Clock className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                          <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                            <strong>Application Status:</strong>{" "}
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Open
                            </span>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Calendar className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                          <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                            <strong>Start Date:</strong> {formatDate(internship.startDate)}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Calendar className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                          <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                            <strong>End Date:</strong> {formatDate(internship.endDate)}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <User className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                          <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                            <strong>Students Assigned:</strong> {internship.assignedStudents?.length || 0} /{" "}
                            {internship.numberOfStudents}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Requirements Tab */}
              {(activeTab === "requirements" || true) && (
                <div className={`mt-6 ${activeTab !== "requirements" ? "hidden print:block" : ""}`}>
                  <h2
                    className="text-xl font-semibold text-gray-800 mb-3 print:text-green-600 print:mt-4"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Requirements & Responsibilities
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <h3
                        className="text-lg font-medium text-gray-800 mb-2"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        Qualifications
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                          Currently enrolled in a relevant degree program
                        </li>
                        <li style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                          Strong academic record with minimum GPA of 3.0
                        </li>
                        <li style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                          Knowledge of {getCategoryLabel(internship.category)} principles and practices
                        </li>
                        <li style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                          Excellent communication and teamwork skills
                        </li>
                        <li style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                          Ability to work independently and take initiative
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3
                        className="text-lg font-medium text-gray-800 mb-2"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        Responsibilities
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                          Assist with day-to-day operations in the {getCategoryLabel(internship.category)} department
                        </li>
                        <li style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                          Collaborate with team members on ongoing projects
                        </li>
                        <li style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                          Participate in regular team meetings and contribute ideas
                        </li>
                        <li style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                          Complete assigned tasks within deadlines
                        </li>
                        <li style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                          Document work and prepare reports as required
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3
                        className="text-lg font-medium text-gray-800 mb-2"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        Benefits
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                          Hands-on experience in a professional environment
                        </li>
                        <li style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                          Mentorship from experienced professionals
                        </li>
                        <li style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                          Opportunity to build a professional network
                        </li>
                        <li style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                          {internship.compensationType === "paid"
                            ? "Competitive compensation"
                            : "Academic credit available"}
                        </li>
                        <li style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                          Potential for future employment opportunities
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {(activeTab === "contact" || true) && (
                <div className={`mt-6 ${activeTab !== "contact" ? "hidden print:block" : ""}`}>
                  <h2
                    className="text-xl font-semibold text-gray-800 mb-3 print:text-green-600 print:mt-4"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Contact Information
                  </h2>

                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 print:bg-white">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <User className="h-5 w-5 mr-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p
                            className="font-medium text-gray-700"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            Supervisor
                          </p>
                          <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                            {internship.supervisorName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Mail className="h-5 w-5 mr-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p
                            className="font-medium text-gray-700"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            Email
                          </p>
                          <a
                            href={`mailto:${internship.supervisorEmail}`}
                            className="text-green-600 hover:underline"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            {internship.supervisorEmail}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Building className="h-5 w-5 mr-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p
                            className="font-medium text-gray-700"
                            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                          >
                            Institution
                          </p>
                          <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                            {internship.hostInstitution}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Apply Button - Desktop */}
            <div className="mt-8 print:hidden">
              <button
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md transition-colors duration-200 flex items-center justify-center"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Apply for Internship
              </button>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 print:hidden">
          <div className="p-6">
            <h2
              className="text-xl font-semibold text-gray-800 mb-4"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Additional Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mr-3 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    Application Deadline
                  </p>
                  <p className="text-gray-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    Applications must be submitted at least 2 weeks before the internship start date.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <FileText className="h-5 w-5 mr-3 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    Required Documents
                  </p>
                  <ul
                    className="list-disc pl-5 mt-1 text-gray-600"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    <li>Resume/CV</li>
                    <li>Cover Letter</li>
                    <li>Academic Transcript</li>
                    <li>Letter of Recommendation (optional)</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start">
                <Download className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    Resources
                  </p>
                  <div className="mt-1">
                    <a
                      href="#"
                      className="text-green-600 hover:underline block"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      Download Internship Information Pack
                    </a>
                    <a
                      href="#"
                      className="text-green-600 hover:underline block mt-1"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      View Application Guidelines
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </IndustryLayout>
  )
}

export default InternshipDetails

