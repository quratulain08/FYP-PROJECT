  "use client";

  import { useEffect, useState } from "react";
  import { useParams, useRouter } from "next/navigation";
  import * as XLSX from "xlsx";
  import Layout from "@/app/components/Layout";
  import BatchSummary from '@/app/admin/Batch/[slug]/page';

  interface Student {
    _id: string;
    name: string;
    department: string;
    batch: string;
    didInternship: boolean;
    registrationNumber: string;
    section: string;
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
    const [batches, setBatches] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedBatch, setSelectedBatch] = useState<string>("All");
    const [selectedSection, setSelectedSection] = useState<string>("All");
    const [error, setError] = useState<string | null>(null);
    const [sections, setSections] = useState<string[]>([]); // Added state for sections

    const [department, setDepartment] = useState<Department | null>(null);
    const params = useParams();
    const DepartmentID = params.departmentid as string;
    const batch = params.batch as string;



    const [newStudent, setNewStudent] = useState<Student>({
      _id: "",
      name: "",
      department: "",
      batch: "",
      didInternship: false,
      registrationNumber: "",
      section: "",
    });
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

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


          const uniqueSections = Array.from(
            new Set(filteredByDepartment.map((student) => student.section))
          );
          // Extract unique batches for filter options
          const uniqueBatches = Array.from(
            new Set(filteredByDepartment.map((student) => student.batch))
          );
          setBatches(uniqueBatches);
          setSections(uniqueSections); // Set sections for filter

        } catch (err) {
          setError(`Error fetching data ${DepartmentID} `);
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

    const openUploadModal = () => {
      setShowModal(true);
    };

    const closeModal = () => {
      setShowModal(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) setFile(selectedFile);
    };

    const handleUpload = async () => {
      if (!file) return alert("Please select an Excel file.");
    
      setUploading(true);
    
      try {
        // Parse the Excel file to JSON
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
        // Prepare form data to send with file
        const formData = new FormData();
        formData.append("file", file);
    
        // Attach the student data (jsonData) as JSON in the form data
        formData.append("students", JSON.stringify(jsonData));
    
        // Upload the formData
        const response = await fetch("/api/upload-students", {
          method: "POST",
          body: formData,
        });
    
        if (!response.ok) {
          const error = await response.json();
          console.error(`Failed to upload students: ${error.message}`);
        } else {
          alert("Data uploaded successfully.");
          setShowModal(false);  // Close the modal after successful upload
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload data.");
      } finally {
        setUploading(false);
      }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
      <Layout>

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-semibold text-green-600 mb-8">
          Students in Department: {department?.name}
        </h1>
        <div className="flex justify-between mb-6">
          <div className="flex space-x-4">
            <Filter
              label="Internship Status"
              value={selectedInternshipStatus}
              options={[ "Yes", "No"]}
              onChange={(e) => setSelectedInternshipStatus(e.target.value)}
            />
              
          </div>
          <button
            onClick={openUploadModal}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Add New Student
          </button>
        </div>

        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">Reg.No</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Section</th>

              <th className="py-2 px-4 text-left">Batch</th>
              <th className="py-2 px-4 text-left">Internship</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            
            {filteredStudents .filter((student) => student.batch === batch)
            .map((student) => (
              <tr key={student._id} className="border-b border-gray-300">
                <td className="py-2 px-4">{student.registrationNumber}</td>
                <td className="py-2 px-4">{student.name}</td>
                <td className="py-2 px-4">{student.section}</td>

                <td className="py-2 px-4">{student.batch}</td>

                <td className="py-2 px-4">
                  {student.didInternship ? "Yes" : "No"}
                </td>
                <td className="py-2 px-4 space-x-4">
                  {/* <button
                    onClick={() => {
                      setEditingStudent(student);
                      setShowModal(true);
                    }}
                    className="text-blue-500"
                  >
                    Edit
                  </button> */}
                  <button
                    onClick={() => deleteStudent(student._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
              <h2 className="text-2xl font-semibold text-green-600 mb-4">
                Upload Students Data
              </h2>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="mb-4"
              />
              <div className="flex justify-between">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </Layout>

    );
  
  };

  export default StudentsPage;
