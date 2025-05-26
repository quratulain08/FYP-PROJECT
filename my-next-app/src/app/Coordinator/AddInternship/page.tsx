'use client'; // Add this line to mark the component as client-side

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CoordinatorLayout from "../CoordinatorLayout";
export default function AddInternship() {
  const router = useRouter();
  const params = useParams();
  const departmentID = params.slug as string; // To capture the department ID from URL if needed

  const [internship, setInternship] = useState({
    title: "",
    hostInstitution: "",
    location: "",
    category: "",
    startDate: "",
    endDate: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInternship((prevInternship) => ({
      ...prevInternship,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(departmentID);
      const response = await fetch(`/api/internship/${departmentID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(internship)
      });

      if (!response.ok) {
        throw new Error("Failed to add internship");
      }

      // Redirect to the department details page after adding the internship
      router.push(`/admin/Internship/${departmentID}`);
    } catch (err) {
      setError("Error adding the internship. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CoordinatorLayout>
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-blue-600 mb-6">Add New Internship</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-8 border border-blue-500">
        <form onSubmit={handleSubmit}>
          {/* Internship Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700">Internship Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={internship.title}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
            />
          </div>

          {/* Host Institution */}
          <div className="mb-4">
            <label htmlFor="hostInstitution" className="block text-sm font-semibold text-gray-700">Host Institution</label>
            <input
              type="text"
              id="hostInstitution"
              name="hostInstitution"
              value={internship.hostInstitution}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={internship.location}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={internship.category}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
            />
          </div>

          {/* Start Date */}
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={internship.startDate}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
            />
          </div>

          {/* End Date */}
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={internship.endDate}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={internship.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 text-white bg-blue-600 rounded-lg mt-4 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Adding Internship..." : "Add Internship"}
          </button>
        </form>
        
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </div>
    </CoordinatorLayout>
  );
}
