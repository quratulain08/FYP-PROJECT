"use client";

import { useEffect, useState } from "react";

// Define a type for the student data
interface Student {
  _id: string;
  name: string;
  department: string;
  batch: string;
  didInternship: boolean;
  registrationNumber: string;
}

const Filter = ({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => (
  <div>
    <label htmlFor={label} className="text-green-600 font-semibold">{label}:</label>
    <select
      id={label}
      value={value}
      onChange={onChange}
      className="border border-gray-300 p-2 rounded-lg"
    >
      <option value="All">All</option>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<string[]>([]); // List of departments for filter
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [selectedInternshipStatus, setSelectedInternshipStatus] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/students"); // Adjust the API route accordingly
        if (!res.ok) throw new Error("Failed to fetch data");
        const data: Student[] = await res.json(); // Type assertion here
        console.log("Fetched data:", data); // Log the fetched data to check its structure
        if (data && data.length > 0) {
          setStudents(data);
          setFilteredStudents(data);

          // Extract departments for dropdown filter
          const uniqueDepartments = Array.from(new Set(data.map((student) => student.department)));
          console.log("Unique Departments:", uniqueDepartments); // Log the departments
          setDepartments(uniqueDepartments);
        } else {
          throw new Error("No data found");
        }
      } catch (err) {
        setError({
          message: 'Error fetching student data',
          details: err instanceof Error ? err.message : 'Unknown error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on selected filters
  useEffect(() => {
    let filtered = students;

    if (selectedDepartment !== "All") {
      filtered = filtered.filter(student => student.department === selectedDepartment);
    }

    if (selectedInternshipStatus !== "All") {
      const didInternship = selectedInternshipStatus === "Yes";
      filtered = filtered.filter(student => student.didInternship === didInternship);
    }

    setFilteredStudents(filtered);
  }, [selectedDepartment, selectedInternshipStatus, students]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {/* Skeleton Loader */}
        <div className="animate-pulse bg-gray-300 rounded-lg p-4 w-48 h-8"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl w-full">
          <h2 className="text-red-700 text-xl font-semibold mb-2">Error</h2>
          <p className="text-red-600 mb-2">{error.message}</p>
          {error.details && (
            <details className="mt-2">
              <summary className="text-red-500 cursor-pointer">Technical Details</summary>
              <pre className="mt-2 p-2 bg-red-100 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                {error.details}
              </pre>
            </details>
          )}
          <button
            onClick={handleRetry}
            className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (filteredStudents?.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">No students found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-green-600 mb-8">All Students</h1>

      {/* Filters */}
      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <Filter
            label="Department"
            value={selectedDepartment}
            options={[ ...departments]} // Adding "All" option at the top
            onChange={(e) => setSelectedDepartment(e.target.value)}
          />
          <Filter
            label="Internship Status"
            value={selectedInternshipStatus}
            options={[ "Yes", "No"]} // All options for internship status
            onChange={(e) => setSelectedInternshipStatus(e.target.value)}
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-green-500 mb-8">
        <table className="min-w-full table-auto">
          <thead className="bg-green-100">
            <tr>
              <th className="py-2 px-4 text-left font-semibold text-green-600">Registration Number</th>
              <th className="py-2 px-4 text-left font-semibold text-green-600">Department</th>
              <th className="py-2 px-4 text-left font-semibold text-green-600">Batch</th>
              <th className="py-2 px-4 text-left font-semibold text-green-600">Internship Status</th>
              <th className="py-2 px-4 text-left font-semibold text-green-600">Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id} className="hover:bg-green-50">
                <td className="py-2 px-4">{student.registrationNumber}</td>
                <td className="py-2 px-4">{student.name}</td>
                <td className="py-2 px-4">{student.department}</td>
                <td className="py-2 px-4">{student.batch}</td>
                <td className="py-2 px-4">{student.didInternship ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsPage;
