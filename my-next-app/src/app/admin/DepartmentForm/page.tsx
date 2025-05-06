"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Layout from "@/app/components/Layout"
import { Building, User, Save, Info, AlertCircle } from "lucide-react"

const DepartmentDashboard: React.FC = () => {
  const router = useRouter()
  const [department, setDepartment] = useState({
    name: "",
    startDate: "",
    category: "",
    hodName: "",
    honorific: "Mr.",
    cnic: "",
    email: "",
    phone: "",
    landLine: "",
    focalPersonName: "",
    focalPersonHonorific: "Mr.",
    focalPersonCnic: "",
    focalPersonEmail: "",
    focalPersonPhone: "",
    CoordinatorName: "",
    CoordinatorHonorific: "Mr.",
    CoordinatorCnic: "",
    CoordinatorEmail: "",
    CoordinatorPhone: "",
    university: "",
  })

  // Validation states
  const [errors, setErrors] = useState({
    cnic: "",
    email: "",
    focalPersonCnic: "",
    focalPersonEmail: "",
    CoordinatorCnic: "",
    CoordinatorEmail: "",
  })

  const [statusMessage, setStatusMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [universityId, setUniversityId] = useState("")
  const [isCheckingCnic, setIsCheckingCnic] = useState(false)

  const categories = ["Computing", "Engineering", "Management Sciences", "Mathematics & Natural Sciences"]

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
  const checkCnicExists = async (cnic: string, field: string) => {
    if (!validateCnic(cnic)) return false

    setIsCheckingCnic(true)
    try {
      const response = await fetch(`/api/check-cnic?cnic=${cnic}`, {
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

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Special handling for CNIC fields
    if (name === "cnic" || name === "focalPersonCnic" || name === "CoordinatorCnic") {
      const formattedCnic = formatCnic(value)

      setDepartment({ ...department, university: universityId, [name]: formattedCnic })

      // Validate CNIC format
      if (formattedCnic.length > 0 && !validateCnic(formattedCnic)) {
        setErrors((prev) => ({ ...prev, [name]: "CNIC must be in format: 12345-1234567-1" }))
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }))

        // Check for duplicate CNIC if format is valid
        if (validateCnic(formattedCnic)) {
          const exists = await checkCnicExists(formattedCnic, name)
          if (exists) {
            setErrors((prev) => ({ ...prev, [name]: "This CNIC already exists in the system" }))
          }
        }
      }
    }
    // Special handling for email fields
    else if (name === "email" || name === "focalPersonEmail" || name === "CoordinatorEmail") {
      setDepartment({ ...department, university: universityId, [name]: value })

      // Validate email format
      if (value.length > 0 && !validateEmail(value)) {
        setErrors((prev) => ({ ...prev, [name]: "Please enter a valid email address" }))
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }))
      }
    }
    // Default handling for other fields
    else {
      setDepartment({ ...department, university: universityId, [name]: value })
    }
  }

  // Get department initials (up to 2 characters)
  const getDepartmentInitials = () => {
    if (!department.name) return "DP"

    const words = department.name.split(" ")
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return department.name.substring(0, 2).toUpperCase()
  }

  // Validate all fields before submission
  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    // Validate HOD fields
    if (!validateCnic(department.cnic)) {
      newErrors.cnic = "CNIC must be in format: 12345-1234567-1"
      isValid = false
    }

    if (!validateEmail(department.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    // Validate Focal Person fields
    if (!validateCnic(department.focalPersonCnic)) {
      newErrors.focalPersonCnic = "CNIC must be in format: 12345-1234567-1"
      isValid = false
    }

    if (!validateEmail(department.focalPersonEmail)) {
      newErrors.focalPersonEmail = "Please enter a valid email address"
      isValid = false
    }

    // Validate Coordinator fields
    if (!validateCnic(department.CoordinatorCnic)) {
      newErrors.CoordinatorCnic = "CNIC must be in format: 12345-1234567-1"
      isValid = false
    }

    if (!validateEmail(department.CoordinatorEmail)) {
      newErrors.CoordinatorEmail = "Please enter a valid email address"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form before submission
    if (!validateForm()) {
      setStatusMessage("Please fix the errors in the form before submitting.")
      setMessageType("error")
      return
    }

    setIsSubmitting(true)
    setStatusMessage("")

    // Helper function to generate random 8-digit password
    const generateRandomPassword = () => {
      return Math.random().toString(36).slice(-8)
    }

    // Generate passwords for Coordinator and Focal Person
    const coordinatorPassword = generateRandomPassword()
    const focalPersonPassword = generateRandomPassword()

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
      const departmentPayload = {
        ...department,
        university: universityId, // Use directly here
      }

      const response = await fetch("/api/department", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(departmentPayload),
      })

      if (!response.ok) {
        throw new Error("Error creating department")
      }

      const result = await response.json()
      console.log("Department created:", result)
      setStatusMessage("Department created successfully!")
      setMessageType("success")

      // Register Coordinator with a random password
      const coordinatorResponse = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: department.CoordinatorEmail,
          password: coordinatorPassword,
          role: "Coordinator",
          university: universityId,
        }),
      })

      if (!coordinatorResponse.ok) {
        throw new Error("Error registering Coordinator")
      }
      console.log("Coordinator registered")

      // Register Focal Person with a random password
      const focalPersonResponse = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: department.focalPersonEmail,
          password: focalPersonPassword,
          role: "FocalPerson",
          university: universityId,
        }),
      })

      if (!focalPersonResponse.ok) {
        throw new Error("Error registering Focal Person")
      }
      console.log("Focal Person registered")

      // Send email notifications for both users
      const emailResponsee = await fetch("/api/sendEmail-Coordinator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinatorEmail: department.CoordinatorEmail,
          coordinatorPassword: coordinatorPassword,
        }),
      })

      if (!emailResponsee.ok) {
        throw new Error("Error sending email to Coordinator")
      }
      console.log("Coordinator email sent successfully")

      // Send email notifications for both users
      const emailResponse = await fetch("/api/sendEmail-Focalperson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          focalPersonEmail: department.focalPersonEmail,
          focalPersonPassword: focalPersonPassword,
        }),
      })

      if (!emailResponse.ok) {
        throw new Error("Error sending email to Focal Person")
      }
      console.log("Focal Person email sent successfully")

      // Reset the form after successful submission
      setDepartment({
        name: "",
        startDate: "",
        category: "",
        hodName: "",
        honorific: "Mr.",
        cnic: "",
        email: "",
        phone: "",
        landLine: "",
        focalPersonName: "",
        focalPersonHonorific: "Mr.",
        focalPersonCnic: "",
        focalPersonEmail: "",
        focalPersonPhone: "",
        CoordinatorName: "",
        CoordinatorHonorific: "Mr.",
        CoordinatorCnic: "",
        CoordinatorEmail: "",
        CoordinatorPhone: "",
        university: String(universityId) || "",
      })

      // Redirect to departments list after a short delay
      setTimeout(() => {
        router.push("/admin/Department")
      }, 2000)
    } catch (error) {
      console.error(error)
      setStatusMessage("Failed to create department or register users. Please try again.")
      setMessageType("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold text-green-600 flex items-center">
            <Building className="mr-2 h-6 w-6" />
            Add New Department
          </h1>
        </div>

        {/* Department Preview */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 mb-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Department Name</label>
                  <input
                    type="text"
                    name="name"
                    value={department.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter department name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={department.startDate}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={department.category}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* HoD Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                HoD Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Honorific</label>
                  <select
                    name="honorific"
                    value={department.honorific}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">HoD Name</label>
                  <input
                    type="text"
                    name="hodName"
                    value={department.hodName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter HoD name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">CNIC</label>
                  <input
                    type="text"
                    name="cnic"
                    value={department.cnic}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.cnic ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors`}
                    placeholder="Format: 12345-1234567-1"
                    required
                  />
                  {errors.cnic && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.cnic}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={department.email}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors`}
                    placeholder="Enter email address"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={department.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Land Line</label>
                  <input
                    type="text"
                    name="landLine"
                    value={department.landLine}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter land line number (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Focal Person Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Focal Person Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Honorific</label>
                  <select
                    name="focalPersonHonorific"
                    value={department.focalPersonHonorific}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Focal Person Name</label>
                  <input
                    type="text"
                    name="focalPersonName"
                    value={department.focalPersonName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter focal person name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">CNIC</label>
                  <input
                    type="text"
                    name="focalPersonCnic"
                    value={department.focalPersonCnic}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.focalPersonCnic ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors`}
                    placeholder="Format: 12345-1234567-1"
                    required
                  />
                  {errors.focalPersonCnic && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.focalPersonCnic}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="focalPersonEmail"
                    value={department.focalPersonEmail}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.focalPersonEmail ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors`}
                    placeholder="Enter email address"
                    required
                  />
                  {errors.focalPersonEmail && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.focalPersonEmail}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="focalPersonPhone"
                    value={department.focalPersonPhone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Coordinator Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Coordinator Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Honorific</label>
                  <select
                    name="CoordinatorHonorific"
                    value={department.CoordinatorHonorific}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Coordinator Name</label>
                  <input
                    type="text"
                    name="CoordinatorName"
                    value={department.CoordinatorName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter coordinator name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">CNIC</label>
                  <input
                    type="text"
                    name="CoordinatorCnic"
                    value={department.CoordinatorCnic}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.CoordinatorCnic ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors`}
                    placeholder="Format: 12345-1234567-1"
                    required
                  />
                  {errors.CoordinatorCnic && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.CoordinatorCnic}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="CoordinatorEmail"
                    value={department.CoordinatorEmail}
                    onChange={handleChange}
                    className={`w-full p-3 border ${errors.CoordinatorEmail ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors`}
                    placeholder="Enter email address"
                    required
                  />
                  {errors.CoordinatorEmail && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.CoordinatorEmail}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="CoordinatorPhone"
                    value={department.CoordinatorPhone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Information Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="text-blue-500 w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-blue-700 text-sm">
                  After creating the department, accounts will be automatically created for the Focal Person and
                  Coordinator. They will receive login credentials via email.
                </p>
              </div>
            </div>

            {/* Status Message */}
            {statusMessage && (
              <div
                className={`p-4 rounded-lg ${messageType === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}
              >
                {statusMessage}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                className="inline-flex items-center bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                disabled={isSubmitting || isCheckingCnic || Object.values(errors).some((error) => error !== "")}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Department...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Add Department
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

export default DepartmentDashboard
