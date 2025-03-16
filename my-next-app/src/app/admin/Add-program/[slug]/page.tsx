"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Layout from "@/app/components/Layout"
import {
  Calendar,
  Tag,
  Phone,
  Mail,
  User,
  Clock,
  FileText,
  Plus,
  BookOpen,
  Target,
  X,
  ArrowLeft,
  Save,
} from "lucide-react"

export default function AddProgram() {
  const router = useRouter()
  const params = useParams()
  const departmentID = params.slug as string

  const [program, setProgram] = useState({
    name: "",
    startDate: "",
    category: "",
    durationYears: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    programHead: "",
    programHeadContact: {
      email: "",
      phone: "",
    },
    programObjectives: [""],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    switch (name) {
      case "programHeadContact.email":
        setProgram((prevProgram) => ({
          ...prevProgram,
          programHeadContact: {
            ...prevProgram.programHeadContact,
            email: value,
          },
        }))
        break

      case "programHeadContact.phone":
        setProgram((prevProgram) => ({
          ...prevProgram,
          programHeadContact: {
            ...prevProgram.programHeadContact,
            phone: value,
          },
        }))
        break

      default:
        setProgram((prevProgram) => ({
          ...prevProgram,
          [name]: value,
        }))
    }
  }

  const handleObjectiveChange = (index: number, value: string) => {
    const updatedObjectives = [...program.programObjectives]
    updatedObjectives[index] = value
    setProgram((prevProgram) => ({
      ...prevProgram,
      programObjectives: updatedObjectives,
    }))
  }

  const addObjectiveField = () => {
    setProgram((prevProgram) => ({
      ...prevProgram,
      programObjectives: [...prevProgram.programObjectives, ""],
    }))
  }

  const removeObjectiveField = (index: number) => {
    const updatedObjectives = program.programObjectives.filter((_, i) => i !== index)
    setProgram((prevProgram) => ({
      ...prevProgram,
      programObjectives: updatedObjectives,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/program/${departmentID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(program),
      })

      if (!response.ok) {
        throw new Error("Failed to add program")
      }

      router.push(`/admin/Program/${departmentID}`)
    } catch (err) {
      setError("Error adding the program. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Get program initials (up to 2 characters)
  const getProgramInitials = () => {
    if (!program.name) return "NP"

    const words = program.name.split(" ")
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return program.name.substring(0, 2).toUpperCase()
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <button onClick={() => router.back()} className="mr-4 text-gray-600 hover:text-green-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-green-600 flex items-center">
            <BookOpen className="mr-2 h-6 w-6" />
            Add New Program
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          {/* Program Preview */}
          {/* <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-100">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">{getProgramInitials()}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800 text-center mb-2">{program.name || "Program Name"}</h2>
            <p className="text-sm text-gray-500 text-center mb-2">{program.category || "Program Category"}</p>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1 text-green-500" />
              <span>{program.durationYears || "0"} years</span>
            </div>
          </div> */}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Program Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700">
                  <BookOpen className="w-4 h-4 mr-2 text-green-500" />
                  Program Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={program.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter program name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="category" className="flex items-center text-sm font-medium text-gray-700">
                  <Tag className="w-4 h-4 mr-2 text-green-500" />
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={program.category}
                  onChange={handleChange}
                  required
                  placeholder="Enter program category"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label htmlFor="startDate" className="flex items-center text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-green-500" />
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={program.startDate}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label htmlFor="durationYears" className="flex items-center text-sm font-medium text-gray-700">
                  <Clock className="w-4 h-4 mr-2 text-green-500" />
                  Duration (Years)
                </label>
                <input
                  type="number"
                  id="durationYears"
                  name="durationYears"
                  value={program.durationYears}
                  onChange={handleChange}
                  required
                  min="1"
                  max="10"
                  placeholder="Enter duration in years"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4 mr-2 text-green-500" />
                Program Description
              </label>
              <textarea
                id="description"
                name="description"
                value={program.description}
                onChange={handleChange}
                placeholder="Enter program description"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Email */}
              <div className="space-y-2">
                <label htmlFor="contactEmail" className="flex items-center text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4 mr-2 text-green-500" />
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={program.contactEmail}
                  onChange={handleChange}
                  required
                  placeholder="Enter contact email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>

              {/* Contact Phone */}
              <div className="space-y-2">
                <label htmlFor="contactPhone" className="flex items-center text-sm font-medium text-gray-700">
                  <Phone className="w-4 h-4 mr-2 text-green-500" />
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={program.contactPhone}
                  onChange={handleChange}
                  placeholder="Enter contact phone"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
            </div>

            {/* Program Head */}
            <div className="space-y-2">
              <label htmlFor="programHead" className="flex items-center text-sm font-medium text-gray-700">
                <User className="w-4 h-4 mr-2 text-green-500" />
                Program Head
              </label>
              <input
                type="text"
                id="programHead"
                name="programHead"
                value={program.programHead}
                onChange={handleChange}
                required
                placeholder="Enter program head name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            {/* Program Head Contact */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Phone className="w-4 h-4 mr-2 text-green-500" />
                Program Head Contact
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  id="programHeadContactEmail"
                  name="programHeadContact.email"
                  value={program.programHeadContact.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
                <input
                  type="tel"
                  id="programHeadContactPhone"
                  name="programHeadContact.phone"
                  value={program.programHeadContact.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
            </div>

            {/* Program Objectives */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Target className="w-4 h-4 mr-2 text-green-500" />
                Program Objectives
              </label>

              <div className="space-y-3">
                {program.programObjectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => handleObjectiveChange(index, e.target.value)}
                      placeholder={`Objective ${index + 1}`}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />

                    <button
                      type="button"
                      onClick={() => removeObjectiveField(index)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      title="Remove objective"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addObjectiveField}
                className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors"
              >
                <Plus size={18} className="mr-1" />
                Add Objective
              </button>
            </div>

            {/* Error Message */}
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>}

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
                disabled={loading}
                className="inline-flex items-center bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Add Program
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

