"use client";
import Layout from '../components/Layout';

import { useEffect, useState } from "react";

interface Student {
  _id: string;
  name: string;
  department: string;
  batch: string;
  didInternship: boolean;
  registrationNumber: string;
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

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [selectedInternshipStatus, setSelectedInternshipStatus] =
    useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newStudent, setNewStudent] = useState<Student>({
    _id: "",
    name: "",
    department: "",
    batch: "",
    didInternship: false,
    registrationNumber: "",
  });
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/students");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data: Student[] = await res.json();
        setStudents(data);
        setFilteredStudents(data);
        const uniqueDepartments = Array.from(
          new Set(data.map((student) => student.department))
        );
        setDepartments(uniqueDepartments);
      } catch (err) {
        setError("Error fetching student data");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = students;
    if (selectedDepartment !== "All") {
      filtered = filtered.filter(
        (student) => student.department === selectedDepartment
      );
    }
    if (selectedInternshipStatus !== "All") {
      const didInternship = selectedInternshipStatus === "Yes";
      filtered = filtered.filter(
        (student) => student.didInternship === didInternship
      );
    }
    setFilteredStudents(filtered);
  }, [selectedDepartment, selectedInternshipStatus, students]);

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

  const openAddModal = () => {
    setNewStudent({
      _id: "",
      name: "",
      department: "",
      batch: "",
      didInternship: false,
      registrationNumber: "",
    });
    setShowModal(true);
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
    <Layout>

    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-green-600 mb-8">All Students</h1>
      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <Filter
            label="Department"
            value={selectedDepartment}
            options={["All", ...departments]}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          />
          <Filter
            label="Internship Status"
            value={selectedInternshipStatus}
            options={["All", "Yes", "No"]}
            onChange={(e) => setSelectedInternshipStatus(e.target.value)}
          />
        </div>
        <button
          onClick={openAddModal}
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

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingStudent ? "Edit Student" : "Add New Student"}
            </h2>
            <form
              onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
            >
              <label className="block">Name</label>
              <input
                type="text"
                value={
                  editingStudent ? editingStudent.name : newStudent.name
                }
                onChange={(e) =>
                  editingStudent
                    ? setEditingStudent({
                        ...editingStudent,
                        name: e.target.value,
                      })
                    : setNewStudent({ ...newStudent, name: e.target.value })
                }
                className="border p-2 w-full rounded-lg mb-4"
              />

              <label className="block">Department</label>
              <input
                type="text"
                value={
                  editingStudent ? editingStudent.department : newStudent.department
                }
                onChange={(e) =>
                  editingStudent
                    ? setEditingStudent({
                        ...editingStudent,
                        department: e.target.value,
                      })
                    : setNewStudent({ ...newStudent, department: e.target.value })
                }
                className="border p-2 w-full rounded-lg mb-4"
              />

              <label className="block">Batch</label>
              <input
                type="text"
                value={editingStudent ? editingStudent.batch : newStudent.batch}
                onChange={(e) =>
                  editingStudent
                    ? setEditingStudent({
                        ...editingStudent,
                        batch: e.target.value,
                      })
                    : setNewStudent({ ...newStudent, batch: e.target.value })
                }
                className="border p-2 w-full rounded-lg mb-4"
              />

              <label className="block">Internship Status</label>
              <select
                value={
                  editingStudent
                    ? editingStudent.didInternship
                      ? "Yes"
                      : "No"
                    : newStudent.didInternship
                    ? "Yes"
                    : "No"
                }
                onChange={(e) =>
                  editingStudent
                    ? setEditingStudent({
                        ...editingStudent,
                        didInternship: e.target.value === "Yes",
                      })
                    : setNewStudent({
                        ...newStudent,
                        didInternship: e.target.value === "Yes",
                      })
                }
                className="border p-2 w-full rounded-lg mb-4"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>

              <div className="flex justify-end space-x-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  {editingStudent ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );

};

export default StudentsPage;
