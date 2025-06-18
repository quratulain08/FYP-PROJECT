'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProgram() {
  const router = useRouter();
  const params = useParams();
  const programId = params.programId as string;
  const departmentId = params.departmentId as string;


  const [program, setProgram] = useState({
    _id:"",
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
      phone: ""
    },
    programObjectives: [""]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the program data based on programId (slug) on component mount
  useEffect(() => {
    if (programId) {
      const fetchProgramData = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/program/${departmentId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch program data");
          }
  
          const data = await response.json();
          let dataItemMatch = null;
  
          // Find the correct data item that matches the programId
          for (const dataItem of data) {
            if (dataItem._id === programId) {
              dataItemMatch = dataItem;
                
              // Format the startDate to "YYYY-MM-DD"
              if (dataItemMatch.startDate) {
                dataItemMatch.startDate = new Date(dataItemMatch.startDate)
                  .toISOString()
                  .split("T")[0]; // "YYYY-MM-DD"
              }
              setProgram(dataItemMatch);
              break;
            }
          }
  
          if (!dataItemMatch) {
            setError("Program ID mismatch. Data does not match the selected program.");
          }
        } catch (err) {
          setError("Error fetching program data. Please try again.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchProgramData();
    }
  }, [programId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProgram((prevProgram) => ({
      ...prevProgram,
      [name]: value
    }));
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const updatedObjectives = [...program.programObjectives];
    updatedObjectives[index] = value;
    setProgram((prevProgram) => ({
      ...prevProgram,
      programObjectives: updatedObjectives
    }));
  };

  const addObjectiveField = () => {
    setProgram((prevProgram) => ({
      ...prevProgram,
      programObjectives: [...prevProgram.programObjectives, ""]
    }));
  };

  const removeObjectiveField = (index: number) => {
    const updatedObjectives = program.programObjectives.filter((_, i) => i !== index);
    setProgram((prevProgram) => ({
      ...prevProgram,
      programObjectives: updatedObjectives
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/program/${programId}`, {
        method: "PUT", // Use PUT to update the program
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(program)
      });

      if (!response.ok) {
        throw new Error("Failed to update program");
      }

      // Redirect to the department details page after editing
      router.push(`/admin/Program/${departmentId}`);
    } catch (err) {
      setError("Error updating the program. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-green-600 mb-6">Edit Program</h1>
      <div className="bg-white rounded-lg shadow-lg p-8 border border-green-500">
        {loading ? (
          <p>Loading program data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Program Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Program Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={program.name}
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
                value={program.startDate}
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
                value={program.category}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg mt-2"
              />
            </div>

            {/* Duration */}
            <div className="mb-4">
              <label htmlFor="durationYears" className="block text-sm font-semibold text-gray-700">Duration (Years)</label>
              <input
                type="number"
                id="durationYears"
                name="durationYears"
                value={program.durationYears}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg mt-2"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Program Description</label>
              <textarea
                id="description"
                name="description"
                value={program.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                rows={4}
              />
            </div>

            {/* Contact Email */}
            <div className="mb-4">
              <label htmlFor="contactEmail" className="block text-sm font-semibold text-gray-700">Contact Email</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={program.contactEmail}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg mt-2"
              />
            </div>

            {/* Contact Phone */}
            <div className="mb-4">
              <label htmlFor="contactPhone" className="block text-sm font-semibold text-gray-700">Contact Phone</label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={program.contactPhone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg mt-2"
              />
            </div>

            {/* Program Head */}
            <div className="mb-4">
              <label htmlFor="programHead" className="block text-sm font-semibold text-gray-700">Program Head</label>
              <input
                type="text"
                id="programHead"
                name="programHead"
                value={program.programHead}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg mt-2"
              />
            </div>

            {/* Program Head Contact */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">Program Head Contact</label>
              <div className="flex space-x-4">
                <input
                  type="email"
                  id="programHeadContactEmail"
                  name="programHeadContact.email"
                  value={program.programHeadContact.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-1/2 p-3 border border-gray-300 rounded-lg mt-2"
                />
                <input
                  type="tel"
                  id="programHeadContactPhone"
                  name="programHeadContact.phone"
                  value={program.programHeadContact.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-1/2 p-3 border border-gray-300 rounded-lg mt-2"
                />
              </div>
            </div>

            {/* Objectives */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700">Program Objectives</label>
              {program.programObjectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => handleObjectiveChange(index, e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                    placeholder={`Objective ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeObjectiveField(index)}
                    className="p-2 bg-red-600 text-white rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addObjectiveField}
                className="mt-4 p-2 bg-green-600 text-white rounded-lg"
              >
                Add Objective
              </button>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white p-3 rounded-lg"
              >
                {loading ? "Updating..." : "Update Program"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
