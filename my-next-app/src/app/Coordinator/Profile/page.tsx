"use client"

import type React from "react"

import { useEffect, useState } from "react"
import CoordinatorLayout from "../CoordinatorLayout"
import { User, Mail, Phone, CreditCard, Building, Edit, Save, X, AlertCircle } from "lucide-react"

interface Department {
  id: string
  name: string
  startDate: string
  category: string
  hodName: string
  honorific: string
  cnic: string
  email: string
  phone: string
  landLine?: string
  focalPersonName: string
  focalPersonHonorific: string
  focalPersonCnic: string
  focalPersonEmail: string
  focalPersonPhone: string
  CoordinatorName: string
  CoordinatorHonorific: string
  CoordinatorCnic: string
  CoordinatorEmail: string
  CoordinatorPhone: string
}

const CoordinatorProfile: React.FC = () => {
  const [profile, setProfile] = useState<Department | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Department>>({})

  useEffect(() => {
    try {
      const email = localStorage?.getItem("email") ;
   
      if (email) {
        fetchProfile(email)
      } else {
        setError("Email not found in localStorage.")
        setLoading(false)
      }
    } catch {
      setError("LocalStorage access is not available.")
      setLoading(false)
    }
  }, [])


  const fetchProfile = async (email: string) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch(`/api/ProfileForCoordinator?CoordinatorEmail=${email}`)
      if (response.ok) {
        const data: Department = await response.json()
        setProfile(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to fetch profile.")
      }
    } catch {
      setError("Network error: Unable to fetch profile.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof Department, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateInputs = (): boolean => {
    if (!formData.CoordinatorName || formData.CoordinatorName.trim().length < 2) {
      setError("Name must be at least 2 characters long.")
      return false
    }

    if (!formData.CoordinatorPhone || !/^\d{10,15}$/.test(formData.CoordinatorPhone)) {
      setError("Phone number must be between 10 and 15 digits.")
      return false
    }

    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateInputs() || !profile) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { CoordinatorEmail, CoordinatorCnic, CoordinatorName, CoordinatorPhone, ...profileToUpdate } = profile

      const response = await fetch("/api/ProfileForCoordinator", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CoordinatorEmail,
          CoordinatorCnic,
          CoordinatorName: formData.CoordinatorName,
          CoordinatorPhone: formData.CoordinatorPhone,
          ...profileToUpdate,
        }),
      })

      if (response.ok) {
        await fetchProfile(CoordinatorEmail)
        setSuccess("Profile updated successfully.")
        setEditMode(false)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to update profile.")
      }
    } catch {
      setError("Network error: Unable to update profile.")
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return (
      <CoordinatorLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </CoordinatorLayout>
    )
  }

  return (
    <CoordinatorLayout>
      <div className="max-w-4xl mx-auto p-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
            <div className="h-5 w-5 bg-green-500 rounded-full text-white flex items-center justify-center mr-3 flex-shrink-0">
              ✓
            </div>
            <p className="text-green-600">{success}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-300 to-indigo-600 px-6 py-12 text-center">
            <div className="mx-auto h-32 w-32 rounded-full bg-white flex items-center justify-center mb-4 border-4 border-white shadow-lg">
              <span className="text-4xl font-bold text-Blue-600">
                {profile?.CoordinatorName ? getInitials(profile.CoordinatorName) : "CO"}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              {profile?.CoordinatorHonorific} {profile?.CoordinatorName}
            </h1>
            <p className="text-green-100 mt-1">Coordinator</p>
          </div>

          <div className="p-6">
            {!editMode ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h2>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-800">
                          {profile?.CoordinatorHonorific} {profile?.CoordinatorName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-medium text-gray-800">{profile?.CoordinatorEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium text-gray-800">{profile?.CoordinatorPhone}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">CNIC</p>
                        <p className="font-medium text-gray-800">{profile?.CoordinatorCnic}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Department Information</h2>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="font-medium text-gray-800">{profile?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <User className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Head of Department</p>
                        <p className="font-medium text-gray-800">
                          {profile?.honorific} {profile?.hodName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.CoordinatorName || ""}
                    onChange={(e) => handleChange("CoordinatorName", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profile?.CoordinatorEmail || ""}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.CoordinatorPhone || ""}
                    onChange={(e) => handleChange("CoordinatorPhone", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
                  <input
                    type="text"
                    value={profile?.CoordinatorCnic || ""}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">CNIC cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={profile?.name || ""}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </CoordinatorLayout>
  )
}

export default CoordinatorProfile

