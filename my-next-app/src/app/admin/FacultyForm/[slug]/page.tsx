"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Layout from "./../../../components/Layout"
import { User, MapPin, Briefcase, GraduationCap, Save, ArrowLeft, Info, AlertCircle } from "lucide-react"

const provinces = [
  { name: "Punjab", cities: ["Lahore", "Faisalabad", "Rawalpindi", "Multan"] },
  { name: "Sindh", cities: ["Karachi", "Hyderabad", "Sukkur", "Larkana"] },
  { name: "Khyber Pakhtunkhwa", cities: ["Peshawar", "Mardan", "Abbottabad", "Swat"] },
  { name: "Balochistan", cities: ["Quetta", "Gwadar", "Sibi", "Zhob"] },
  { name: "Gilgit-Baltistan", cities: ["Gilgit", "Skardu", "Hunza", "Ghanche"] },
  { name: "Azad Kashmir", cities: ["Muzaffarabad", "Mirpur", "Rawalakot", "Bhimber"] },
]

export default function FacultyForm() {
  const router = useRouter()
  const params = useParams()
  const id = params.slug as string
  const departmentId = id
  const [faculty, setFaculty] = useState<{ university?: string }>({})

  const [selectedProvince, setSelectedProvince] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [honorific, setHonorific] = useState<string>("Mr")
  const [name, setName] = useState<string>("")
  const [cnic, setCnic] = useState<string>("")
  const [cnicError, setCnicError] = useState<string>("")
  const [gender, setGender] = useState<string>("Male")
  const [address, setAddress] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [emailError, setEmailError] = useState<string>("")
  const [contractType, setContractType] = useState<string>("Permanent")
  const [academicRank, setAcademicRank] = useState<string>("Professor")
  const [joiningDate, setJoiningDate] = useState<string>("")
  const [leavingDate, setLeavingDate] = useState<string>("")
  const [isCoreComputingTeacher, setIsCoreComputingTeacher] = useState<boolean>(false)
  const [degreeName, setDegreeName] = useState<string>("")
  const [degreeType, setDegreeType] = useState<string>("")
  const [fieldOfStudy, setFieldOfStudy] = useState<string>("")
  const [degreeAwardingCountry, setDegreeAwardingCountry] = useState<string>("")
  const [degreeAwardingInstitute, setDegreeAwardingInstitute] = useState<string>("")
  const [degreeStartDate, setDegreeStartDate] = useState<string>("")
  const [degreeEndDate, setDegreeEndDate] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")
  const [messageType, setMessageType] = useState<"success" | "error">("error")
  const [error, setError] = useState("")
  const [isCheckingCnic, setIsCheckingCnic] = useState(false)

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // CNIC validation function
  const validateCnic = (cnic: string) => {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/
    return cnicRegex.test(cnic)
  }

  // Format CNIC as user types
  const formatCnic = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // Don't add hyphens if we don't have enough digits
    if (digits.length <= 5) return digits

    // Add first hyphen
    let formatted = `${digits.substring(0, 5)}-`

    // Add second hyphen if we have enough digits
    if (digits.length <= 12) {
      formatted += digits.substring(5)
    } else {
      formatted += `${digits.substring(5, 12)}-${digits.substring(12, 13)}`
    }

    return formatted
  }

  // Check if CNIC already exists
  const checkCnicExists = async (cnicValue: string) => {
    if (!validateCnic(cnicValue)) return false

    setIsCheckingCnic(true)
    try {
      const response = await fetch(`/api/check-cnic?cnic=${cnicValue}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to check CNIC")
      }

      const data = await response.json()
      return data.exists
    } catch (error) {
      console.error("Error checking CNIC:", error)
      return false
    } finally {
      setIsCheckingCnic(false)
    }
  }

  const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvince(event.target.value)
    setSelectedCity("")
  }

  const handleCnicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCnic = formatCnic(e.target.value)
    setCnic(formattedCnic)

    // Validate CNIC format
    if (formattedCnic.length > 0 && !validateCnic(formattedCnic)) {
      setCnicError("CNIC must be in format: 12345-1234567-1")
    } else {
      setCnicError("")

      // Check for duplicate CNIC if format is valid
      if (validateCnic(formattedCnic)) {
        const exists = await checkCnicExists(formattedCnic)
        if (exists) {
          setCnicError("This CNIC already exists in the system")
        }
      }
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value
    setEmail(emailValue)

    // Validate email format
    if (emailValue.length > 0 && !validateEmail(emailValue)) {
      setEmailError("Please enter a valid email address")
    } else {
      setEmailError("")
    }
  }

  useEffect(() => {
    fetchUniversity()
  }, [])

  const fetchUniversity = async () => {
    try {
      const email = localStorage.getItem("email")
      if (!email) {
        throw new Error("Email not found in localStorage.")
      }

      const res = await fetch(`/api/UniversityByEmailAdmin/${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch university ID for ${email}`)
      }

      const data = await res.json()
      const universityId = data.universityId

      // Set the universityId in the department state
      setFaculty((prevState) => ({
        ...prevState,
        university: universityId || prevState.university, // Ensure existing value remains if universityId is undefined
      }))
    } catch (err) {
      setError("Error fetching university information.")
    } finally {
      setLoading(false)
    }
  }

  // Get faculty initials (up to 2 characters)
  const getFacultyInitials = () => {
    if (!name) return "FT"

    const words = name.split(" ")
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Validate form before submission
  const validateForm = () => {
    let isValid = true

    // Validate CNIC
    if (!validateCnic(cnic)) {
      setCnicError("CNIC must be in format: 12345-1234567-1")
      isValid = false
    }

    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      isValid = false
    }

    return isValid
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    // Validate form before submission
    if (!validateForm()) {
      setMessage("Please fix the errors in the form before submitting.")
      setMessageType("error")
      return
    }

    setLoading(true)
    setMessage("")

    if (!departmentId) {
      setMessage("Department ID is missing")
      setMessageType("error")
      setLoading(false)
      return
    }

    const facultyData = {
      departmentId,
      honorific,
      name,
      cnic,
      gender,
      address,
      province: selectedProvince,
      city: selectedCity,
      contractType,
      academicRank,
      joiningDate,
      leavingDate,
      email,
      isCoreComputingTeacher,
      university: faculty.university,
      lastAcademicQualification: {
        degreeName,
        degreeType,
        fieldOfStudy,
        degreeAwardingCountry,
        degreeAwardingInstitute,
        degreeStartDate,
        degreeEndDate,
      },
    }
    try {
      const response = await fetch("/api/faculty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(facultyData),
      })

      if (!response.ok) {
        throw new Error("Failed to create faculty member")
      }

      const data = await response.json()
      setMessage("Faculty member created successfully!")
      setMessageType("success")

      // Navigate back to department detail page after successful submission
      setTimeout(() => {
        router.push(`/admin/Department/${departmentId}`)
      }, 1500)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage("An unknown error occurred.")
      }
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <button onClick={() => router.back()} className="mr-4 text-gray-600 hover:text-green-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-green-600 flex items-center">
            <User className="mr-2 h-6 w-6" />
            Add New Faculty Member
          </h1>
        </div>

        {/* Faculty Preview */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 mb-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Instructions Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-blue-700 font-semibold mb-2 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Instructions
              </h2>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>1. Name & CNIC cannot be changed once added.</li>
                <li>2. For Computing Faculty Types and Requirements/Criteria please visit the website.</li>
                <li>3. Core Computing Teacher (Check Box) must be checked for computing faculty.</li>
                <li>4. CNIC must be in format: 12345-1234567-1</li>
              </ul>
            </div>

            {/* Personal Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Honorific</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={honorific}
                    onChange={(e) => setHonorific(e.target.value)}
                  >
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Dr">Dr</option>
                    <option value="Prof">Prof</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">CNIC</label>
                  <input
                    type="text"
                    className={`w-full p-3 border ${cnicError ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors`}
                    value={cnic}
                    onChange={handleCnicChange}
                    placeholder="Format: 12345-1234567-1"
                    required
                  />
                  {cnicError && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {cnicError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className={`w-full p-3 border ${emailError ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors`}
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter email address"
                    required
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {emailError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Address Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter full address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Province</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    required
                  >
                    <option value="">Select Province</option>
                    {provinces.map((province) => (
                      <option key={province.name} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedProvince}
                    required
                  >
                    <option value="">Select City</option>
                    {selectedProvince &&
                      provinces
                        .find((p) => p.name === selectedProvince)
                        ?.cities?.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Employment Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Contract Type</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value)}
                    required
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Contract">Contract</option>
                    <option value="Visiting">Visiting</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Academic Rank</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={academicRank}
                    onChange={(e) => setAcademicRank(e.target.value)}
                    required
                  >
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Lab Instructor">Lab Instructor</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Joining Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Leaving Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={leavingDate}
                    onChange={(e) => setLeavingDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2 flex items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isCoreComputingTeacher"
                      checked={isCoreComputingTeacher}
                      onChange={(e) => setIsCoreComputingTeacher(e.target.checked)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="isCoreComputingTeacher" className="ml-2 text-sm font-medium text-gray-700">
                      Core Computing Teacher
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Last Academic Qualification */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Last Academic Qualification
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Degree Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={degreeName}
                    onChange={(e) => setDegreeName(e.target.value)}
                    placeholder="e.g. Bachelor of Science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Degree Type</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={degreeType}
                    onChange={(e) => setDegreeType(e.target.value)}
                    placeholder="e.g. BS, MS, PhD"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Field of Study</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="e.g. Computer Science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Degree Awarding Country</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={degreeAwardingCountry}
                    onChange={(e) => setDegreeAwardingCountry(e.target.value)}
                    placeholder="e.g. Pakistan"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Degree Awarding Institute</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={degreeAwardingInstitute}
                    onChange={(e) => setDegreeAwardingInstitute(e.target.value)}
                    placeholder="e.g. University of XYZ"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Degree Start Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={degreeStartDate}
                    onChange={(e) => setDegreeStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Degree End Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    value={degreeEndDate}
                    onChange={(e) => setDegreeEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-lg ${messageType === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}
              >
                {message}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.back()}
                className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                disabled={loading || isCheckingCnic || !!cnicError || !!emailError}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Add Faculty
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
