"use client";

import { FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import FocalPersonLayout from "../../FocalPersonLayout";

interface Internship {
  _id: string;
  title: string;
  hostInstitution: string;
  location: string;
  category: string;
  startDate: string;
  endDate: string;
  description: string;
}

const Internships: React.FC = () => {
  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const Internshipid = params.slug as string;

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await fetch(`/api/internships/${Internshipid}`);
      if (!response.ok) throw new Error("Failed to fetch internship");

      const data = await response.json();
      setInternship(data);
    } catch (err) {
      setError("Error fetching internship.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this internship?")) {
      try {
        const response = await fetch(`/api/internships/${Internshipid}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();

        if (response.ok) {
          alert(result.message);
          router.push("/admin/internships"); // Redirect to internships list
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Error deleting internship:", error);
        alert("Failed to delete internship.");
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 text-xl">{error}</p>
      </div>
    );

  if (internship) {
    return (
      <FocalPersonLayout>
              <div className="max-w-7xl mx-auto p-6">
        <div className="border border-gray-300 rounded-lg shadow-lg p-6 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-green-600">{internship.title}</h1>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
              title="Delete"
            >
              <FaTrash size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700">
                <span className="font-semibold">Host Institution:</span> {internship.hostInstitution}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Category:</span> {internship.category}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Location:</span> {internship.location}
              </p>
            </div>
            <div>
              <p className="text-gray-700">
                <span className="font-semibold">Start Date:</span> {internship.startDate}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">End Date:</span> {internship.endDate}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{internship.description}</p>
          </div>
        </div>
      </div>
      </FocalPersonLayout>

    );
  }

  return null;
};

export default Internships;
