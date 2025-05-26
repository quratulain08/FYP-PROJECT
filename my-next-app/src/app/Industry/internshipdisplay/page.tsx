"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import IndustryLayout from "../IndustryLayout"
import { Briefcase, Calendar, MapPin, Building, Search, Filter, X, Plus, ChevronRight, XCircle } from "lucide-react"

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
  rejectionComment: string
  AssigningIndustry: string
  isComplete: boolean
}

interface University {
  _id: string
  name: string
  address: string
  contactEmail: string
  location: string
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
  AssigningIndustry: string

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
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [internships, setInternships] = useState<Internship[]>([])
  // const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [universityName, setUniversityName] = useState<string>("")
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([])
  const universityId = params?.slug as string
  const [universities, setUniversities] = useState<University[]>([])
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [activeRejection, setActiveRejection] = useState<Internship | null>(null)
  // const [ObjectID, setObjectID] = useState<string>("")
  const [completedInternships, setCompletedInternships] = useState<Internship[]>([]);
const [incompleteInternships, setIncompleteInternships] = useState<Internship[]>([]);


  // Add this style tag for animations
  const fadeInAnimation = `
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.2s ease-out forwards;
    }
  `

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
    AssigningIndustry: "",

  })

  const fetchUniversities = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/universities")
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      setUniversities(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch universities")
    } finally {
      setLoading(false)
    }
  }

  const getUserObjectId = async (): Promise<string | null> => {
    try {
      const email = localStorage.getItem("email");
      if (!email) throw new Error("Email not found in localStorage");
  
     
    const res = await fetch(`/api/industryByEmail/${email}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch user ID");
    }

    const data = await res.json();
    // setObjectID(data._id);
    fetchInternships(data._id);

  
      return data.userId;
    } catch (error) {
      console.error("Error getting user ID:", error);
      return null;
    }
  };
  
  
  useEffect(() => {
    getUserObjectId()
    fetchUniversities()
  }, [])

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
      const uniRes = await fetch(`/api/universityByName/${formData.hostInstitution}`)
      if (!uniRes.ok) {
        throw new Error("Failed to fetch university ID")
      }
      const university = await uniRes.json()
      const universityId = university.id;

      if (!university?.id) {
        throw new Error("University not found")
      }

      const email= localStorage.getItem('email');

      const emailRes = await fetch(`/api/industryByEmail/${email}`)
      if (!emailRes.ok) {
        throw new Error("Failed to fetch university ID")
      }
      const AssignedIndustry = await emailRes.json()

      if (!AssignedIndustry?._id) {
        throw new Error("AssignedIndustry not found")
      }


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
          AssigningIndustry: AssignedIndustry._id,

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
        AssigningIndustry: "",
      })

      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create internship")
      console.error("Error creating internship:", err)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    filterInternships()
  }, [searchTerm, filterCategory, internships])

  const fetchInternships = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch("/api/internships")
      if (!response.ok) throw new Error("Failed to fetch internships")
  
      const data = await response.json()
  
      const filtered = data.filter(
        (internship: any) => String(internship.AssigningIndustry) === String(id)
      )
      const completed = filtered.filter((i: any) => i.isComplete);
const incomplete = filtered.filter((i: any) => !i.isComplete);

      setInternships(filtered);
      setCompletedInternships(completed);
setIncompleteInternships(incomplete);
      setFilteredInternships(filtered)
    } catch (err) {
      setError("Error fetching internships.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filterInternships = () => {
    let filtered = [...internships]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (internship) =>
          internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.hostInstitution.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter((internship) => internship.category === filterCategory)
    }

    setFilteredInternships(filtered)
  }

  const handleCardClick = (id: string) => {
    router.push(`/Industry/internships/${id}`)
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click

    if (window.confirm("Are you sure you want to delete this internship?")) {
      try {
        const response = await fetch(`/api/internships/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })

        const result = await response.json()

        if (response.ok) {
          alert(result.message)
        } else {
          alert(`Error: ${result.error}`)
        }
      } catch (error) {
        console.error("Error deleting internship:", error)
        alert("Failed to delete internship.")
      }
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilterCategory("")
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

  // Get unique categories
  const categories = [...new Set(internships.map((internship) => internship.category))]


  const handleMarkAsComplete = async (internshipId:string) => {
    const confirmed = window.confirm("Are you sure you want to mark this internship as complete?");
    if (!confirmed) return;
  
    try {
      const res = await fetch(`/api/MarkasComplete/${internshipId}`, {
        method: 'PUT',
      });
  
      if (!res.ok) throw new Error('Failed to mark internship as complete.');
  
      alert('Internship marked as complete!');
      location.reload();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <style>{fadeInAnimation}</style>
      <IndustryLayout>
        if(e){}
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
                    htmlFor="university"
                    className="block text-sm font-medium text-gray-700"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif'" }}
                  >
                    Host Institution <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="hostInstitution"
                    name="hostInstitution"
                    value={formData.hostInstitution} // Ensuring it's part of form state
                    onChange={handleChange} // Handling changes properly
                    required
                    className="w-full border p-2 rounded bg-white text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif'" }}
                  >
                    <option value="">Select a University</option>
                    {universities.length > 0 ? (
                      universities.map((university) => (
                        <option key={university._id} value={university.name}>
                          {" "}
                          {/* Storing name instead of ID */}
                          {university.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading universities...</option>
                    )}
                  </select>
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

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1
            className="text-3xl font-bold text-green-600 mb-4 md:mb-0"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          ></h1>

          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search internships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full md:w-64"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full appearance-none"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category)}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {(searchTerm || filterCategory) && (
              <button
                onClick={clearFilters}
                className="flex items-center justify-center text-gray-600 hover:text-gray-800"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {filteredInternships.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3
              className="mt-4 text-lg font-medium text-gray-900"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              No internships found
            </h3>
            <p className="mt-2 text-sm text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              {searchTerm || filterCategory
                ? "Try adjusting your search filters"
                : "No internships are currently available"}
            </p>
          </div>
        ) : ( 
          
          <>
    {incompleteInternships.length > 0 && (
      <>
        <h2 className="text-xl font-bold mt-8 mb-4 text-gray-800" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
          Incomplete Internships
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {incompleteInternships.map((internship) => (
              <div
                key={internship._id}
                onClick={() => handleCardClick(internship._id)}
                className="bg-white border border-gray-200 hover:border-green-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h2
                      className="text-xl font-semibold text-gray-800 line-clamp-2"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      {internship.title}
                    </h2>
                    <div className="flex flex-col items-end">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {getCategoryLabel(internship.category)}
                      </span>
                      {internship.rejectionComment && (
                        <span
                          className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full cursor-pointer hover:bg-red-200"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveRejection(internship)
                            setShowRejectionModal(true)
                          }}
                        >
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>

  

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Building className="h-4 w-4 mr-2 text-green-600" />
                      <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        {internship.hostInstitution}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-green-600" />
                      <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        {internship.location === "onsite"
                          ? "On-site"
                          : internship.location === "oncampus"
                            ? "On-campus"
                            : internship.location}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-green-600" />
                      <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        {formatDate(internship.startDate)} - {formatDate(internship.endDate)}
                      </span>
                    </div>
                  </div>

                  <p
                    className="text-gray-600 line-clamp-3 mb-4"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    {internship.description}
                  </p>
                </div>
                <button
  onClick={(e) => {
    e.stopPropagation();
    handleMarkAsComplete(internship._id);
  }}
  className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded"
>
  Mark as Complete
</button>

                <div className="bg-green-50 p-3 flex justify-between items-center">
                  <div
                    className="flex items-center text-green-600 font-medium"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Assign Task
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>

                  <button
                    onClick={(e) => handleDelete(internship._id, e)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    aria-label="Delete internship"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
             ))}
             </div>
           </>
        )}
     

         {completedInternships.length > 0 && (
      <>
        <h2 className="text-xl font-bold mt-12 mb-4 text-gray-800" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
          Completed Internships
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedInternships.map((internship) => (
                  <div
                    key={internship._id}
                    onClick={() => handleCardClick(internship._id)}
                    className="bg-white border border-gray-200 hover:border-green-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h2
                          className="text-xl font-semibold text-gray-800 line-clamp-2"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          {internship.title}
                        </h2>
                        <div className="flex flex-col items-end">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            {getCategoryLabel(internship.category)}
                          </span>
                          {internship.rejectionComment && (
                            <span
                              className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full cursor-pointer hover:bg-red-200"
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveRejection(internship)
                                setShowRejectionModal(true)
                              }}
                            >
                              Rejected
                            </span>
                          )}
                        </div>
                      </div>
    
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Building className="h-4 w-4 mr-2 text-green-600" />
                          <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                            {internship.hostInstitution}
                          </span>
                        </div>
    
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-green-600" />
                          <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                            {internship.location === "onsite"
                              ? "On-site"
                              : internship.location === "oncampus"
                                ? "On-campus"
                                : internship.location}
                          </span>
                        </div>
    
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-green-600" />
                          <span style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                            {formatDate(internship.startDate)} - {formatDate(internship.endDate)}
                          </span>
                        </div>
                      </div>
    
                      <p
                        className="text-gray-600 line-clamp-3 mb-4"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        {internship.description}
                      </p>
                    </div>
    
                    <div className="bg-green-50 p-3 flex justify-between items-center">
                      <div
                        className="flex items-center text-green-600 font-medium"
                        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                      >
                        Assign Task
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
    
                      <button
                        onClick={(e) => handleDelete(internship._id, e)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                        aria-label="Delete internship"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
               
                 ))}
        </div>
      </>
    )}
  </>
)}

        
        {/* Rejection Comment Modal */}
        {showRejectionModal && activeRejection && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-96 overflow-hidden animate-fadeIn">
              <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <XCircle className="h-5 w-5 mr-2" />
                    Rejection Details
                  </h2>
                  <button
                    onClick={() => setShowRejectionModal(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-1">Internship Title</h3>
                  <p className="text-gray-700">{activeRejection.title}</p>
                </div>
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-1">Host Institution</h3>
                  <p className="text-gray-700">{activeRejection.hostInstitution}</p>
                </div>
                <div className="mb-6">
                  <h3 className="font-medium text-red-600 mb-1">Rejection Reason</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-gray-800">
                    {activeRejection.rejectionComment}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowRejectionModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </IndustryLayout>
    </div>
  )
}

export default InternshipPage
