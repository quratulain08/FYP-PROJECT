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
  section: string;
}

interface Batch {
  batch: string;
  total: number;
  didInternship: number;
  missingInternship: number;
  totalSections: number;
}

const BatchSummary: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [newBatchName, setNewBatchName] = useState<string>("");
  const [showAddBatchModal, setShowAddBatchModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error] = useState<string | null>(null);
  //const [showModal, setShowModal] = useState<boolean>(false);

  const router = useRouter();
  const params = useParams();
  const departmentId = params.slug as string;

  const handleViewDetails = (batch: string) => {
    router.push(`/admin/Students/${departmentId}/${batch}`);
  };

  const fetchBatchData = async () => {
    try {
      const res = await fetch("/api/students");
      if (!res.ok) throw new Error("Failed to fetch students");

      const students: Student[] = await res.json();

      const departmentRes = await fetch(`/api/department/${departmentId}`);
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

  const handleAddBatch = async () => {
    if (!newBatchName.trim()) {
      alert("Batch name cannot be empty.");
      return;
    }

    try {
      const response = await fetch('/api/Batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batchName: newBatchName,
          departmentId: departmentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add batch');
      }

      // Add the new batch to the table if the API call is successful
      setBatches((prevBatches) => [
        ...prevBatches,
        {
          batch: newBatchName,
          total: 0,
          didInternship: 0,
          missingInternship: 0,
          totalSections: 0,
        },
      ]);

      // Reset modal state
      setNewBatchName("");
      setShowAddBatchModal(false);
    } catch (error) {
      console.error('Error adding batch:', error);
      alert('Error adding batch. Please try again.');
    }
  };

  useEffect(() => {
    fetchBatchData();
  }, [fetchBatchData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (

    
      <div className="max-w-6xl mx-auto p-6">
        if(err){}
        <h1 className="text-3xl font-semibold text-green-600 mb-8">
          Batch Summary for Department
        </h1>
        
        {/* Button to open modal */}
        <button
          onClick={() => setShowAddBatchModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Batch
        </button>

        {/* Modal */}
        {showAddBatchModal && (
          <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-80">
              <h2 className="text-lg font-semibold mb-4">Add New Batch</h2>
              <input
                type="text"
                placeholder="Enter batch name"
                value={newBatchName}
                onChange={(e) => setNewBatchName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddBatchModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBatch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Batch
                </button>
              </div>
            </div>
          </div>
        )}

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
      </div>
  );
};

export default BatchSummary;
