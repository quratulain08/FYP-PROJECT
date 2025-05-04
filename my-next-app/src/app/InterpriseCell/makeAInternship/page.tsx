"use client"

import React, { useEffect, useState } from "react"
import { FaTimes } from 'react-icons/fa';

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

interface MakeAInternshipProps {
  universityId?: string
  onSuccess?: (newInternship: any) => void
}

const internshipCategories = [
  { value: "frontend", label: "Frontend Development" },
  { value: "backend", label: "Backend Development" },
  { value: "fullstack", label: "Full Stack Development" },
  { value: "data", label: "Data Science" },
  { value: "ai", label: "Artificial Intelligence" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "design", label: "Graphic Design" },
  { value: "marketing", label: "Marketing" },
  { value: "other", label: "Other" },
]

const MakeAInternship: React.FC<MakeAInternshipProps> = ({ universityId = "", onSuccess }) => {
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState<InternshipForm>({
    title: '',
    description: '',
    hostInstitution: universityId || "",
    numberOfStudents: 1,
    location: 'onsite',
    category: 'frontend',
    compensationType: 'unpaid',
    compensationAmount: 0,
    startDate: '',
    endDate: '',
    supervisorName: '',
    supervisorEmail: '',
    universityId: universityId || "",
    AssigningIndustry: universityId || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const email1 = localStorage.getItem("email");
      const ress = await fetch(`/api/UniversityByEmailAdmin/${email1}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!ress.ok) {
        throw new Error(`Failed to fetch university ID for ${email1}`);
      }

      const dataa = await ress.json();
      const universityId = dataa.universityId;

      const email = localStorage.getItem("email");
      if (!email) throw new Error("Email not found");

      const res = await fetch("/api/internshipsForIndustories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          numberOfStudents: Number(formData.numberOfStudents),
          compensationAmount: formData.compensationType === "paid" ? Number(formData.compensationAmount) : undefined,
          universityId,
          AssigningIndustry: universityId,
          hostInstitution: universityId,
        }),
      });

      if (!res.ok) throw new Error("Failed to create internship");
      const newInternship = await res.json();

      if (onSuccess) onSuccess(newInternship);

      setFormData({
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
        universityId,
        category: "frontend",
        AssigningIndustry: "",
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              Add a New Internship
            </h2>
            <button onClick={() => setShowForm(false)} className="text-white hover:text-gray-200">
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
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
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
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
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="numberOfStudents" className="block text-sm font-medium text-gray-700">
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
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="onsite">On-site</option>
                  <option value="oncampus">On-campus</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {internshipCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="compensationType" className="block text-sm font-medium text-gray-700">
                  Compensation Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="compensationType"
                  name="compensationType"
                  value={formData.compensationType}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>

              {formData.compensationType === "paid" && (
                <div className="space-y-2">
                  <label htmlFor="compensationAmount" className="block text-sm font-medium text-gray-700">
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
                  />
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
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
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
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
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="supervisorName" className="block text-sm font-medium text-gray-700">
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
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="supervisorEmail" className="block text-sm font-medium text-gray-700">
                  Supervisor Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="supervisorEmail"
                  name="supervisorEmail"
                  value={formData.supervisorEmail}
                  onChange={handleChange}
                  placeholder="Supervisor Email"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              {error && (
                <div className="bg-red-500 text-white p-3 rounded-md text-center">
                  {error}
                </div>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowForm(false)}
                  type="button"
                  className="py-2 px-6 bg-gray-300 rounded-md text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`py-2 px-6 rounded-md text-white ${
                    loading ? "bg-gray-400" : "bg-green-600"
                  }`}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MakeAInternship;
