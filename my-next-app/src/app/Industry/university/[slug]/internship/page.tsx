"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Plus, X, Briefcase, Calendar, MapPin, DollarSign, User } from "lucide-react"
import IndustryLayout from "../../../IndustryLayout"

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
}

interface InternshipForm {
  hostInstitution: string
  title: string
  description: string
  numberOfStudents: number
  location: "onsite" | "oncampus"
  compensationType: "paid" | "unpaid"
  compensationAmount?: number
  supervisorName: string
  supervisorEmail: string
  startDate: string
  endDate: string
  universityId: string
  category: string
}

const internshipCategories = [
  // Technology
  { value: "frontend", label: "Frontend Development", group: "Technology" },
  { value: "backend", label: "Backend Development", group: "Technology" },
  { value: "fullstack", label: "Full Stack Development", group: "Technology" },
  { value: "mobile", label: "Mobile Development", group: "Technology" },
  { value: "devops", label: "DevOps", group: "Technology" },
  { value: "data", label: "Data Science", group: "Technology" },
  { value: "ai", label: "Artificial Intelligence", group: "Technology" },
  { value: "cybersecurity", label: "Cybersecurity", group: "Technology" },
  { value: "cloud", label: "Cloud Computing", group: "Technology" },
  { value: "qa", label: "Quality Assurance", group: "Technology" },

  // Business & Finance
  { value: "accounting", label: "Accounting", group: "Business & Finance" },
  { value: "finance", label: "Finance", group: "Business & Finance" },
  { value: "marketing", label: "Marketing", group: "Business & Finance" },
  { value: "sales", label: "Sales", group: "Business & Finance" },
  { value: "hr", label: "Human Resources", group: "Business & Finance" },
  { value: "consulting", label: "Business Consulting", group: "Business & Finance" },

  // Engineering
  { value: "mechanical", label: "Mechanical Engineering", group: "Engineering" },
  { value: "electrical", label: "Electrical Engineering", group: "Engineering" },
  { value: "civil", label: "Civil Engineering", group: "Engineering" },
  { value: "chemical", label: "Chemical Engineering", group: "Engineering" },
  { value: "aerospace", label: "Aerospace Engineering", group: "Engineering" },

  // Healthcare
  { value: "medical", label: "Medical", group: "Healthcare" },
  { value: "nursing", label: "Nursing", group: "Healthcare" },
  { value: "pharmacy", label: "Pharmacy", group: "Healthcare" },
  { value: "biotech", label: "Biotechnology", group: "Healthcare" },

  // Creative
  { value: "design", label: "Graphic Design", group: "Creative" },
  { value: "content", label: "Content Writing", group: "Creative" },
  { value: "media", label: "Digital Media", group: "Creative" },
  { value: "ui_ux", label: "UI/UX Design", group: "Creative" },

  // Science & Research
  { value: "research", label: "Research & Development", group: "Science & Research" },
  { value: "physics", label: "Physics", group: "Science & Research" },
  { value: "chemistry", label: "Chemistry", group: "Science & Research" },
  { value: "biology", label: "Biology", group: "Science & Research" },

  // Law & Public Policy
  { value: "legal", label: "Legal", group: "Law & Public Policy" },
  { value: "public_policy", label: "Public Policy", group: "Law & Public Policy" },
  { value: "government", label: "Government", group: "Law & Public Policy" },

  // Education
  { value: "teaching", label: "Teaching", group: "Education" },
  { value: "training", label: "Corporate Training", group: "Education" },
  { value: "education_tech", label: "Education Technology", group: "Education" },

  // Others
  { value: "other", label: "Other", group: "Others" },
]

// Group categories by their group property
const groupedCategories = internshipCategories.reduce(
  (acc, category) => {
    if (!acc[category.group]) {
      acc[category.group] = []
    }
    acc[category.group].push(category)
    return acc
  },
  {} as Record<string, typeof internshipCategories>,
)

const InternshipPage = () => {
  const params = useParams()
  const router = useRouter()
  const universityId = params?.slug as string

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [internships, setInternships] = useState<Internship[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [universityName, setUniversityName] = useState<string>("")

  const [formData, setFormData] = useState<InternshipForm>({
    hostInstitution: "",
    title: "",
    description: "",
    numberOfStudents: 1,
    location: "onsite",
    compensationType: "paid",
    compensationAmount: 0,
    supervisorName: "",
    supervisorEmail: "",
    startDate: "",
    endDate: "",
    universityId: universityId,
    category: "frontend",
  })

  const fetchUniversityName = async () => {
    try {
      const res = await fetch(`/api/universities/${universityId}`)
      if (!res.ok) throw new Error("Failed to fetch university details")
      const data = await res.json()
      setUniversityName(data.name)
    } catch (err) {
      console.error("Error fetching university name:", err)
    }
  }

  const fetchInternships = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/internship?universityId=${universityId}`)
      if (!res.ok) {
        throw new Error("Failed to fetch internships")
      }
      const data = await res.json()
      setInternships(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      console.error("Error fetching internships:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (universityId) {
      fetchInternships()
      fetchUniversityName()
    }
  }, [universityId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/internshipsForIndustories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          numberOfStudents: Number(formData.numberOfStudents),
          compensationAmount: formData.compensationType === "paid" ? Number(formData.compensationAmount) : undefined,
          universityId,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to create internship")
      }

      const newInternship = await res.json()
      setInternships((prev) => [newInternship, ...prev])

      // Reset form
      setFormData({
        title: "",
        description: "",
        numberOfStudents: 1,
        location: "onsite",
        compensationType: "paid",
        compensationAmount: 0,
        supervisorName: "",
        supervisorEmail: "",
        startDate: "",
        hostInstitution: "",
        endDate: "",
        universityId: universityId,
        category: "frontend",
      })

      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create internship")
      console.error("Error creating internship:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (internshipId: string) => {
    router.push(`/Industry/internshipdetails/${internshipId}`)
  }

  const filteredInternships =
    selectedCategory === "all"
      ? internships
      : internships.filter((internship) => internship.category === selectedCategory)

  // Get unique categories from available internships
  const availableCategories = [...new Set(internships.map((i) => i.category))]

  return (
    <div className="container mx-auto px-4 py-8">
      <IndustryLayout>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1
              className="text-3xl font-bold text-green-600"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              Internships
            </h1>
            {universityName && (
              <p className="text-gray-600 mt-1" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                for <span className="font-medium">{universityName}</span>
              </p>
            )}
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
            <Plus className="h-4 w-4" />
            <span>Add Internship</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
            <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>{error}</span>
            <button onClick={() => setError(null)} className="text-red-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8 overflow-hidden">
            <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Add a New Internship
              </h2>
              <button onClick={() => setShowForm(false)} className="text-white hover:text-gray-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Internship Title"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Internship Description"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[100px]"
                  required
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="hostInstitution"
                    className="block text-sm font-medium text-gray-700"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Host Institution <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="hostInstitution"
                    name="hostInstitution"
                    value={formData.hostInstitution}
                    onChange={handleChange}
                    placeholder="Host Institution Name"
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="numberOfStudents"
                    className="block text-sm font-medium text-gray-700"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Number of Students <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="numberOfStudents"
                    name="numberOfStudents"
                    type="number"
                    min="1"
                    value={formData.numberOfStudents}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Location Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    <option value="onsite">On-site</option>
                    <option value="oncampus">On-campus</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    {Object.entries(groupedCategories).map(([group, categories]) => (
                      <optgroup key={group} label={group}>
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="compensationType"
                    className="block text-sm font-medium text-gray-700"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Compensation Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="compensationType"
                    name="compensationType"
                    value={formData.compensationType}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>

                {formData.compensationType === "paid" && (
                  <div className="space-y-2">
                    <label
                      htmlFor="compensationAmount"
                      className="block text-sm font-medium text-gray-700"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      Compensation Amount
                    </label>
                    <input
                      id="compensationAmount"
                      name="compensationAmount"
                      type="number"
                      min="0"
                      value={formData.compensationAmount}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="supervisorName"
                    className="block text-sm font-medium text-gray-700"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Supervisor Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="supervisorName"
                    name="supervisorName"
                    value={formData.supervisorName}
                    onChange={handleChange}
                    placeholder="Supervisor Name"
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="supervisorEmail"
                    className="block text-sm font-medium text-gray-700"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Supervisor Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="supervisorEmail"
                    name="supervisorEmail"
                    type="email"
                    value={formData.supervisorEmail}
                    onChange={handleChange}
                    placeholder="supervisor@example.com"
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
                  disabled={loading}
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  {loading ? "Adding..." : "Add Internship"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-6">
          <div className="flex overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-md mr-2 whitespace-nowrap ${
                selectedCategory === "all" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              All Internships
            </button>
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md mr-2 whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                {internshipCategories.find((c) => c.value === category)?.label || category}
              </button>
            ))}
          </div>
        </div>

        {loading && !internships.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : internships.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3
              className="mt-4 text-lg font-medium text-gray-900"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              No internships found
            </h3>
            <p className="mt-2 text-sm text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              Get started by adding your first internship.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredInternships.map((internship) => (
              <div
                key={internship._id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-green-100 hover:border-green-300 rounded-lg bg-white"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mb-2">
                    {internshipCategories.find((cat) => cat.value === internship.category)?.label ||
                      internship.category}
                  </div>
                  <h3
                    className="text-xl font-bold text-gray-800 mb-2"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    {internship.title}
                  </h3>
                  <p
                    className="text-gray-600 mb-4 line-clamp-3"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    {internship.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                      <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        <strong>Duration:</strong> {new Date(internship.startDate).toLocaleDateString()} -{" "}
                        {new Date(internship.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                      <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        <strong>Location:</strong> {internship.location === "onsite" ? "On-site" : "On-campus"}
                      </span>
                    </div>

                    {internship.compensationType === "paid" && internship.compensationAmount && (
                      <div className="flex items-start">
                        <DollarSign className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                        <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                          <strong>Compensation:</strong> ${internship.compensationAmount}
                        </span>
                      </div>
                    )}

                    <div className="flex items-start">
                      <User className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                      <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        <strong>Positions:</strong> {internship.numberOfStudents}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-3 text-center">
                  <button
                    onClick={() => handleViewDetails(internship._id)}
                    className="text-green-600 font-medium hover:text-green-700"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </IndustryLayout>
    </div>
  )
}

export default InternshipPage

