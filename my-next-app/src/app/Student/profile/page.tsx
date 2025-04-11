
"use client";

import { useEffect, useState } from "react";

interface Student {
email:string;
  _id: string;
  name: string;
  department: string;
  batch: string;
  section: string;
  didInternship: boolean;
  registrationNumber: string;
}

const VocalPerson: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
     //   const email = localStorage.getItem("email")

  const email ='wajahat@gmail.com'; 

  useEffect(() => {
    try {  
        fetchStudentProfile(email);
 
    } catch {
      setError("LocalStorage access is not available.");
      setLoading(false);
    }
  }, []);

  const fetchStudentProfile = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`/api/students/${email}`);
      if (response.ok) {
        const data: Student = await response.json();
        setStudent(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch student profile.");
      }
    } catch {
      setError("Network error: Unable to fetch student profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Student, value: string | boolean) => {
    if (student) {
      setStudent({ ...student, [field]: value });
    }
  };

  const validateInputs = (): boolean => {
    if (!student) return false;

    const { name, department, batch, section } = student;

    if (!name || name.trim().length < 2) {
      setError("Name must be at least 2 characters long.");
      return false;
    }
    if (!department || department.trim().length < 2) {
      setError("Department must be valid.");
      return false;
    }
    if (!batch || batch.trim().length < 2) {
      setError("Batch must be valid.");
      return false;
    }
    if (!section || section.trim().length < 1) {
      setError("Section must be valid.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!student || !validateInputs()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { _id, ...studentToUpdate } = student;

      const response = await fetch(`/api/student/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentToUpdate),
      });

      if (response.ok) {
        await fetchStudentProfile(student.email); // Refresh profile
        setSuccess("Profile updated successfully.");
        setEditMode(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update student profile.");
      }
    } catch {
      setError("Network error: Unable to update student profile.");
    } finally {
      setLoading(false);
    }
  };

  const renderDisplay = () => (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-green-600 mb-4">Student Profile</h2>
      {student ? (
        <>
          <p>
            <strong>Name:</strong> {student.name}
          </p>
          <p>
            <strong>Department:</strong> {student.department}
          </p>
          <p>
            <strong>Batch:</strong> {student.batch}
          </p>
          <p>
            <strong>Section:</strong> {student.section}
          </p>
          <p>
            <strong>Did Internship:</strong> {student.didInternship ? "Yes" : "No"}
          </p>
          <button
            onClick={() => setEditMode(true)}
            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all"
          >
            Edit Profile
          </button>
        </>
      ) : (
        <p>No profile found.</p>
      )}
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-50 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Edit Profile</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <input
        type="text"
        placeholder="Name"
        value={student?.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
        className="w-full p-3 border mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="text"
        placeholder="Department"
        value={student?.department || ""}
        onChange={(e) => handleChange("department", e.target.value)}
        className="w-full p-3 border mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="text"
        placeholder="Batch"
        value={student?.batch || ""}
        onChange={(e) => handleChange("batch", e.target.value)}
        className="w-full p-3 border mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="text"
        placeholder="Section"
        value={student?.section || ""}
        onChange={(e) => handleChange("section", e.target.value)}
        className="w-full p-3 border mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all"
      >
        Save Profile
      </button>
    </form>
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : editMode ? renderForm() : renderDisplay()}
    </div>
  );
};

export default VocalPerson;
