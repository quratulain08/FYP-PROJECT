"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Student {
  _id: string;
  name: string;
  department: string;
  batch: string;
  didInternship: boolean;
  registrationNumber: string;
}
interface Department {
  _id: string;
  name: string;
  startDate: string;
  category: string;
  hodName: string;
  honorific: string;
  cnic: string;
  email: string;
  phone: string;
  landLine?: string;
  address: string;
  province: string;
  city: string;
}

const Filter = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div>
    <label htmlFor={label} className="text-green-600 font-semibold">
      {label}:
    </label>
    <select
      id={label}
      value={value}
      onChange={onChange}
      className="border border-gray-300 p-2 rounded-lg"
    >
      <option value="All">All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedInternshipStatus, setSelectedInternshipStatus] = useState<string>("All");
  const [selectedBatch, setSelectedBatch] = useState<string>("All");
  const [batches, setBatches] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const params = useParams();
  const router = useRouter();
  const DepartmentID = params.slug as string;

  const [newStudent, setNewStudent] = useState<Student>({
    _id: "",
    name: "",
    department: "",
    batch: "",
    didInternship: false,
    registrationNumber: "",
  });
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/students");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data: Student[] = await res.json();

        const ress = await fetch(`/api/department/${DepartmentID}`);
        if (!ress.ok) throw new Error("Failed to fetch department data");
        const departmentData: Department = await ress.json();
        setDepartment(departmentData);

        const filteredByDepartment = data.filter(
          (student) => student.department === departmentData.name
        );
        setStudents(filteredByDepartment);
        setFilteredStudents(filteredByDepartment);

        // Extract unique batches for filter options
        const uniqueBatches = Array.from(
          new Set(filteredByDepartment.map((student) => student.batch))
        );
        setBatches(uniqueBatches);
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [DepartmentID]);

  useEffect(() => {
    let filtered = students;

    if (selectedInternshipStatus !== "All") {
      const didInternship = selectedInternshipStatus === "Yes";
      filtered = filtered.filter(
        (student) => student.didInternship === didInternship
      );
    }

    if (selectedBatch !== "All") {
      filtered = filtered.filter((student) => student.batch === selectedBatch);
    }

    setFilteredStudents(filtered);
  }, [selectedInternshipStatus, selectedBatch, students]);

  const deleteStudent = async (id: string) => {
    try {
      const response = await fetch(`/api/students`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setStudents((prev) => prev.filter((student) => student._id !== id));
      } else {
        console.error("Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      if (res.ok) {
        const data: Student = await res.json();
        setStudents([...students, data]);
        setShowModal(false);
      } else {
        console.error("Failed to add student");
      }
    } catch (err) {
      console.error("Error adding student:", err);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      const res = await fetch(`/api/students`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingStudent._id, ...editingStudent }),
      });
      if (res.ok) {
        setStudents((prev) =>
          prev.map((student) =>
            student._id === editingStudent._id ? editingStudent : student
          )
        );
        setShowModal(false);
      } else {
        console.error("Failed to update student");
      }
    } catch (err) {
      console.error("Error updating student:", err);
    }
  };

  const handelAddStudent = () => {
    router.push(`/UploadPage`); // Navigate to department detail page

  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingStudent(null);
    setShowModal(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-green-600 mb-8">
        Students in Department: {department?.name}
      </h1>
      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <Filter
            label="Internship Status"
            value={selectedInternshipStatus}
            options={["All", "Yes", "No"]}
            onChange={(e) => setSelectedInternshipStatus(e.target.value)}
          />
          <Filter
            label="Batch"
            value={selectedBatch}
            options={["All", ...batches]}
            onChange={(e) => setSelectedBatch(e.target.value)}
          />
        </div>
        <button
          onClick={handelAddStudent}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Add New Student
        </button>
      </div>

      <table className="w-full bg-white shadow-lg rounded-lg">
        <thead className="bg-green-100">
          <tr>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Department</th>
            <th className="py-2 px-4">Batch</th>
            <th className="py-2 px-4">Internship Status</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student._id}>
              <td className="py-2 px-4">{student.name}</td>
              <td className="py-2 px-4">{student.department}</td>
              <td className="py-2 px-4">{student.batch}</td>
              <td className="py-2 px-4">
                {student.didInternship ? "Yes" : "No"}
              </td>
              <td className="py-2 px-4 flex space-x-2">
                <button onClick={() => openEditModal(student)}>Edit</button>
                <button
                  onClick={() => deleteStudent(student._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     
    </div>
  );
};

export default StudentsPage;
