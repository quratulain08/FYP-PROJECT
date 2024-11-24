"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as XLSX from "xlsx";

interface Student {
  _id: string;
  name: string;
  department: string;
  batch: string;
  didInternship: boolean;
  registrationNumber: string;
  section: string;
}

const BatchSummary: React.FC = () => {
  const [batches, setBatches] = useState<
    {
      batch: string;
      total: number;
      didInternship: number;
      missingInternship: number;
      totalSections: number;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false); 
  const departmentid=' 674179f1d751474776dc5bd5';
  const router = useRouter();

  const handleViewDetails = (batch: string) => {
    router.push(`/FocalPerson/students/${batch}`);
  };

  const fetchBatchData = async () => {
    try {
      const res = await fetch("/api/students");
      if (!res.ok) throw new Error("Failed to fetch students");

      const students: Student[] = await res.json();

      const departmentRes = await fetch(`/api/department/674179f1d751474776dc5bd5`);
      if (!departmentRes.ok) throw new Error("Failed to fetch department");

      const department = await departmentRes.json();
      const departmentStudents = students.filter(
        (student) => student.department === department.name
      );

      const batchSummary = departmentStudents.reduce((acc, student) => {
        const batchData = acc.find((item) => item.batch === student.batch);
        if (batchData) {
          batchData.total++;
          if (student.didInternship) batchData.didInternship++;
          if (!batchData.sections.includes(student.section)) {
            batchData.sections.push(student.section);
          }
        } else {
          acc.push({
            batch: student.batch,
            total: 1,
            didInternship: student.didInternship ? 1 : 0,
            sections: [student.section],
          });
        }
        return acc;
      }, [] as { batch: string; total: number; didInternship: number; sections: string[] }[]);

      setBatches(
        batchSummary.map((batch) => ({
          batch: batch.batch,
          total: batch.total,
          didInternship: batch.didInternship,
          missingInternship: batch.total - batch.didInternship,
          totalSections: batch.sections.length,
        }))
      );
    } catch (err) {
      setError("Error fetching batch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an Excel file.");
      return;
    }
  
    setUploading(true);
  
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("students", JSON.stringify(jsonData));
  
      const response = await fetch("/api/upload-students", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const error = await response.text();
        console.error("Upload failed:", error);
        alert("Upload failed. Check the console for details.");
        return;
      }
  
      alert("Data uploaded successfully!");
      setShowModal(false);
      fetchBatchData(); // Refresh data
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    } finally {
      setUploading(false);
    }
  };
  
  useEffect(() => {
    fetchBatchData();
  }, [departmentid]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
   
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-semibold text-green-600 mb-8">
            Batch Summary for Department
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4"
          >
            Add Students
          </button>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-left">Batch</th>
                <th className="py-2 px-4 text-left">Total Students</th>
                <th className="py-2 px-4 text-left">Completed Internship</th>
                <th className="py-2 px-4 text-left">Missing Internship</th>
                <th className="py-2 px-4 text-left">Total Sections</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.batch} className="border-b border-gray-300">
                  <td className="py-2 px-4">{batch.batch}</td>
                  <td className="py-2 px-4">{batch.total}</td>
                  <td className="py-2 px-4 text-blue">{batch.didInternship}</td>
                  <td
                    className={`py-2 px-4 ${
                      batch.missingInternship > 0 ? "text-blue-600" : "text-red-600"
                    }`}
                  >
                    {batch.missingInternship}
                  </td>
                  <td className="py-2 px-4">{batch.totalSections}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleViewDetails(batch.batch)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showModal && (
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Upload Excel File</h2>
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileChange}
                  className="mb-4"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
    );
    
};

export default BatchSummary;
