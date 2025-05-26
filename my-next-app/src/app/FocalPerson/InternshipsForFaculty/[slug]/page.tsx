// pages/admin/Internships.tsx

"use client";

import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams,useRouter } from "next/navigation";
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
  assignedFaculty:string;
  assignedStudents:string;
}

const Internships: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const router = useRouter();
  const params = useParams();
  const facultyId = params.slug as string;
  
  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await fetch("/api/internships");
      if (!response.ok) throw new Error("Failed to fetch internships");

      const data = await response.json();
      setInternships(data);
    } catch (err) {
      setError("Error fetching internships.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToInternship = async (internshipId: string) => {
    if (window.confirm('Are you sure you want to assign this faculty member to the internship?')) {
      try {
        const response = await fetch(`/api/internships/${facultyId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ internshipId }), // Send the facultyId in the request body
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert(result.message);
          fetchInternships(); // Refresh internships after successful assignment
        } else {
          alert(`Error: ${result.error || "Failed to assign faculty."}`);
        }
      } catch (error) {
        console.error("Error assigning faculty to internship:", error);
        alert("Failed to assign faculty. Please try again.");
      }
    }
  };
  




  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-xl">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-red-600 text-xl">{error}</p>
    </div>
  );

  return (
    <FocalPersonLayout>
      if(err){}
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Internships</h1>
       
      </div>

      {internships.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No internships available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {internships.map((internship) => (
            <div
              key={internship._id}
              className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition duration-300 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl text-green-600 font-semibold mb-4">
                  {internship.title} - {internship.hostInstitution}
                </h2>
                <div className="flex space-x-2">
                 
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAddToInternship(internship._id); }}
                    className="text-green-500 hover:text-red-600 p-2"
                    title="Add"
                  >
                    <FaPlus size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p><span className="font-semibold">Category:</span> {internship.category}</p>
                  <p><span className="font-semibold">Start Date:</span> {internship.startDate}</p>
                  <p><span className="font-semibold">End Date:</span> {internship.endDate}</p>
                </div>
                <div>
                  <p><span className="font-semibold">Location:</span> {internship.location}</p>
                  <p><span className="font-semibold">Description:</span> {internship.description}</p>
                  <p><span className="font-semibold">Faculity Assigned:</span> {internship.assignedFaculty}</p>
                  <p><span className="font-semibold">Students Assigned:</span> {internship.assignedStudents}</p>
                
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </FocalPersonLayout>

  );
};

export default Internships;
