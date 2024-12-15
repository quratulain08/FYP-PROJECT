"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FocalPersonLayout from "./../FocalPersonLayout";

interface Internship {
  _id: string;
  title: string;
  hostInstitution: string;
  location: string;
  category: string;
  startDate: string;
  endDate: string;
  description: string;
  assignedFaculty: string;
  assignedStudents: string;
}

interface Faculty {
  _id: string;
  name: string;
}

interface Student {
  _id: string;
  name: string;
  department: string;
  batch: string;
  didInternship: boolean;
  registrationNumber: string;
  section: string;
}

const Internships: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const departmentId = "674179f1d751474776dc5bd5";

  useEffect(() => {
    fetchInternships();
    fetchFaculties();
    fetchStudents();
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

  const fetchFaculties = async () => {
    try {
      const response = await fetch(`/api/faculty/department/${departmentId}`);
      if (!response.ok) throw new Error("Failed to fetch faculties");

      const data = await response.json();
      setFaculties(data);
    } catch (err) {
      setError("Error fetching faculties.");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students");
      if (!response.ok) throw new Error("Failed to fetch students");

      const data = await response.json();
      console.log("Fetched Students:", data); // Debugging
      setStudents(data);
    } catch (err) {
      setError("Error fetching students.");
    }
  };

  const handleAssignFaculty = async (internshipId: string, facultyId: string) => {
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
          console.log("Error assigning faculty to internship:", error);
          alert("Failed to assign faculty. Please try again.");
        }
      }
  };

  const handleAssignStudent = async (internshipId: string, studentId: string) => {
    if (window.confirm("Are you sure you want to assign this student to the internship?")) {
        try {
          const response = await fetch(`/api/InternshipsForStudnet/${studentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ internshipId }),
          });
  
          const result = await response.json();
  
          if (response.ok) {
            alert(result.message);
            fetchInternships(); // Refresh internships
          } else {
            alert(`Error: ${result.error}`);
          }
        } catch (error) {
          console.log("Error assigning student:", error);
          alert("Failed to assign student.");
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

  return (
    <FocalPersonLayout>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Internships</h1>
        {internships.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No internships available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 border">Internship Name</th>
                  <th className="p-4 border">Department</th>
                  <th className="p-4 border">Assigned Faculty</th>
                  <th className="p-4 border">Assigned Students</th>
                  <th className="p-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {internships.map((internship) => (
                  <tr key={internship._id} className="hover:bg-gray-50">
                    <td className="p-4 border">{internship.title}</td>
                    <td className="p-4 border">{internship.hostInstitution}</td>
                    <td className="p-4 border">
                      <select
                        className="border rounded px-2 py-1"
                        defaultValue={internship.assignedFaculty || ""}
                        onChange={(e) => handleAssignFaculty(internship._id, e.target.value)}
                      >
                        <option value="" disabled>
                          Select Faculty
                        </option>
                        {faculties.map((faculty) => (
                          <option key={faculty._id} value={faculty._id}>
                            {faculty.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 border">
                      <select
                        className="border rounded px-2 py-1"
                        defaultValue={internship.assignedStudents || ""}
                        onChange={(e) => handleAssignStudent(internship._id, e.target.value)}
                      >
                        <option value="" disabled>
                          Select Student
                        </option>
                        {students.map((student) => (
                          <option key={student._id} value={student._id}>
                            {student.registrationNumber}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 border">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                        onClick={() => router.push(`/internships/${internship._id}`)}
                      >
                        View Details
                      </button>
                      <button
                        className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </FocalPersonLayout>
  );
};

export default Internships;
