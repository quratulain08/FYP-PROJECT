"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, X, Building } from "lucide-react"
import IndustryLayout from "../IndustryLayout"

interface University {
  _id: string
  name: string
  address: string
  contactEmail: string
  location: string
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

const UniversityPage = () => {
  const router = useRouter()
  const [universities, setUniversities] = useState<University[]>([])
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactEmail: "",
    location: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

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

  useEffect(() => {
    fetchUniversities()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.name || !formData.contactEmail || !formData.location) {
      setError("Please fill in all required fields")
      return
    }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error(await res.text())

      setFormData({
        name: "",
        address: "",
        contactEmail: "",
        location: "",
      })

      await fetchUniversities()
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add university")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <IndustryLayout>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-600" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
            Universities
          </h1>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
          >
            <Plus className="h-4 w-4" />
            <span>Add University</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8 overflow-hidden">
            <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                Add a New University
              </h2>
              <button onClick={() => setShowForm(false)} className="text-white hover:text-gray-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="University Name"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="University Address"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contactEmail"
                  className="block text-sm font-medium text-gray-700"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                >
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="university@example.com"
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
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="University Location"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                />
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
                  {loading ? "Adding..." : "Add University"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && !universities.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : universities.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3
              className="mt-4 text-lg font-medium text-gray-900"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              No universities found
            </h3>
            <p className="mt-2 text-sm text-gray-500" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
              Get started by adding your first university.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {universities.map((university) => (
              <div
                key={university._id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-green-100 hover:border-green-300 rounded-lg bg-white"
                onClick={() => {
                  const path = `/Industry/university/${university._id}/internship`
                  router.push(path)
                }}
              >
                <div className="p-6 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-green-400 flex items-center justify-center mb-4">
                    <span
                      className="text-white text-2xl font-bold"
                      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                    >
                      {getInitials(university.name)}
                    </span>
                  </div>

                  <h3
                    className="font-bold text-xl text-center text-gray-800 mb-3"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    {university.name}
                  </h3>

                  <div className="w-full space-y-2 text-gray-600">
                    {university.address && (
                      <div className="flex justify-between">
                        <span className="font-medium" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                          Address:
                        </span>
                        <span className="text-right" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                          {university.address}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="font-medium" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        Location:
                      </span>
                      <span className="text-right" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        {university.location}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        Contact:
                      </span>
                      <span className="text-right" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                        {university.contactEmail}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-3 text-center">
                  <span
                    className="text-green-600 font-medium"
                    style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
                  >
                    View Internships
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </IndustryLayout>
    </div>
  )
}

export default UniversityPage

