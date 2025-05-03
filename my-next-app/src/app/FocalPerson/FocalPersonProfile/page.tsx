"use client"

import type React from "react"

import { useEffect, useState } from "react"
import FocalPersonLayout from "../FocalPersonLayout"
import { User, Mail, Phone, Building, Edit, Save, X, AlertCircle } from "lucide-react"

interface Department {
  _id: string
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
}

const VocalPerson: React.FC = () => {
  const [profile, setProfile] = useState<Department | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Department>>({})

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage?.getItem("email");
        setLoading(true);
        setError(null);
        setSuccess(null);
  
        const response = await fetch(`/api/departmentByfocalperson/${email}`);
        if (response.ok) {
          const data: Department = await response.json();
          setProfile(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch profile.");
        }
      } catch (err) {
        setError("Network error: Unable to fetch profile.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, []);

  // useEffect(() => {
  //   if (profile) {
  //     setFormData({
  //       focalPersonName: profile.focalPersonName,
  //       focalPersonPhone: profile.focalPersonPhone,
  //       name: profile.name,
  //     })
  //   }
  // }, [profile])

  // const fetchProfile = async (email: string) => {
  //   setLoading(true)
  //   setError(null)
  //   setSuccess(null)
  //   try {
  //     const response = await fetch(`/api/departmentByfocalperson/${email}`)
  //     if (response.ok) {
  //       const data: Department = await response.json()
  //       setProfile(data)
  //     } else {
  //       const errorData = await response.json()
  //       setError(errorData.error || "Failed to fetch profile.")
  //     }
  //   } catch {
  //     setError("Network error: Unable to fetch profile.")
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleChange = (field: keyof Department, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateInputs = (): boolean => {
    if (!formData.focalPersonName || formData.focalPersonName.trim().length < 2) {
      setError("Name must be at least 2 characters long.")
      return false
    }

    if (!formData.focalPersonPhone || !/^\d{10,15}$/.test(formData.focalPersonPhone)) {
      setError("Phone number must be between 10 and 15 digits.")
      return false
    }

    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateInputs()) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/vocalPersonProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const email = localStorage?.getItem("email")
        if (email) {
          await fetchProfile(email)
        }
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
      <FocalPersonLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </FocalPersonLayout>
    )
  }

  return (
    <FocalPersonLayout>
      <div className="max-w-4xl mx-auto p-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-red-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
            <div className="h-5 w-5 bg-green-500 rounded-full text-white flex items-center justify-center mr-3 flex-shrink-0">
              ✓
            </div>
            <p className="text-green-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              {success}
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-300 to-indigo-600 px-6 py-12 text-center">
            <div className="mx-auto h-32 w-32 rounded-full bg-white flex items-center justify-center mb-4 border-4 border-white shadow-lg">
              <span
                className="text-4xl font-bold text-blue-600"
                style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
              >
                {profile?.focalPersonName ? getInitials(profile.focalPersonName) : "FP"}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              {profile?.focalPersonHonorific} {profile?.focalPersonName}
            </h1>
            <p className="text-blue-100 mt-1" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              Focal Person
            </p>
          </div>

          <div className="p-6">
            {!editMode ? (
              <>
                <div className="mb-6">
                  <h2
                    className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Personal Information
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p
                          className="text-sm text-gray-500"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          Full Name
                        </p>
                        <p
                          className="font-medium text-gray-800"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          {profile?.focalPersonHonorific} {profile?.focalPersonName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p
                          className="text-sm text-gray-500"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          Email Address
                        </p>
                        <p
                          className="font-medium text-gray-800"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          {profile?.focalPersonEmail}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p
                          className="text-sm text-gray-500"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          Phone Number
                        </p>
                        <p
                          className="font-medium text-gray-800"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          {profile?.focalPersonPhone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="h-5 w-5 flex items-center justify-center text-blue-500 mr-3">
                        <span className="text-xs font-bold">ID</span>
                      </div>
                      <div>
                        <p
                          className="text-sm text-gray-500"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          CNIC
                        </p>
                        <p
                          className="font-medium text-gray-800"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          {profile?.focalPersonCnic}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2
                    className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Department Information
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p
                          className="text-sm text-gray-500"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          Department
                        </p>
                        <p
                          className="font-medium text-gray-800"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          {profile?.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <User className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p
                          className="text-sm text-gray-500"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
                          Head of Department
                        </p>
                        <p
                          className="font-medium text-gray-800"
                          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                        >
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
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.focalPersonName || ""}
                    onChange={(e) => handleChange("focalPersonName", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile?.focalPersonEmail || ""}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  />
                  <p className="mt-1 text-xs text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.focalPersonPhone || ""}
                    onChange={(e) => handleChange("focalPersonPhone", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    CNIC
                  </label>
                  <input
                    type="text"
                    value={profile?.focalPersonCnic || ""}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  />
                  <p className="mt-1 text-xs text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                    CNIC cannot be changed
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
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
    </FocalPersonLayout>
  )
}

export default VocalPerson

