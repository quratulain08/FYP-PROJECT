"use client";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentLayout from "@/app/Student/StudentLayout";
import Student from "@/models/student";

interface Internship {
  _id: string;
  title: string;
  hostInstitution: string;
  location: string;
  category: string;
  startDate: string;
  endDate: string;
  description: string;
  assignedStudents:String;
}

interface Student {
  _id: string;
  name: string;
  department: string;
  batch: string;
  didInternship: boolean;
  registrationNumber: string;
  section: string;
  email: string;
}

const InternshipDisplay: React.FC = () => {
  const [internship, setInternship] = useState<Internship>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
    const [student, setStudents] = useState<Student[]>([]);


  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    const email = "ammary9290111@gmail.com"; // Replace with actual logic to get the email
  
    try {
      // Fetch student data by email
      const responsee = await fetch(`/api/StudentByemail/${email}`);
      if (!responsee.ok) throw new Error("Failed to fetch student details");
  
      const dataa = await responsee.json();
      setStudents(dataa);
  
      if (dataa.length === 0) {
        throw new Error("No students found with the provided email");
      }
  
      const studentId = dataa._id; // Assuming you want the first student in the array
      console.log("Student ID:", studentId); // Debug log

      // Fetch internships by assigned student ID
      const response = await fetch(`/api/InternshipsByAssignedStudents/${studentId}`);
      if (!response.ok) throw new Error("Failed to fetch internships");
  
      const data = await response.json();
      setInternship(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching internships.");
    } finally {
      setLoading(false);
    }
  };                                                                    

  const handleCardClick = (id: string) => {
    router.push(`/Student/taskdisplay/${id}`);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        const response = await fetch(`/api/internships/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();

        if (response.ok) {
          alert(result.message);
          fetchInternships();
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Error deleting internship:", error);
        alert("Failed to delete internship.");
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
    <StudentLayout>
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Internship</h1>
      </div>

      {internship ? (
        <div
          onClick={() => handleCardClick(internship._id)}
          className="border border-gray-300 rounded-lg p-6 shadow-lg hover:shadow-xl transition duration-300"
        >
          <h2 className="text-xl text-green-600 font-semibold mb-4">
            {internship.title} - {internship.hostInstitution}
          </h2>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div>
              <p>
                <span className="font-semibold">Category:</span> {internship.category}
              </p>
              <p>
                <span className="font-semibold">Start Date:</span> {internship.startDate}
              </p>
              <p>
                <span className="font-semibold">End Date:</span> {internship.endDate}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Location:</span> {internship.location}
              </p>
              <p>
                <span className="font-semibold">Description:</span> {internship.description}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No internship available.</p>
        </div>
      )}
    </div>
  </StudentLayout>

  );
};

export default InternshipDisplay;
