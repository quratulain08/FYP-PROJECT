"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/app/components/Layout";

interface Student {
  _id: string;
  name: string;
  department: string;
  batch: string;
  didInternship: boolean;
  registrationNumber: string;
}

const BatchSummary: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const params = useParams();
  const DepartmentID = params.slug as string;

  const [batches, setBatches] = useState<
    { batch: string; total: number; didInternship: number; missingInternship: number }[]
  >([]);

  const handleViewDetails = (batch: string) => {
    router.push(`/admin/Students/${DepartmentID}/${batch}`);
  };
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/students");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data: Student[] = await res.json();

        const ress = await fetch(`/api/department/${DepartmentID}`);
        if (!ress.ok) throw new Error("Failed to fetch department data");
        const departmentData = await ress.json();

        const filteredByDepartment = data.filter(
          (student) => student.department === departmentData.name
        );

        const batchSummary = filteredByDepartment.reduce((acc, student) => {
          const existing = acc.find((item) => item.batch === student.batch);
          if (existing) {
            existing.total++;
            if (student.didInternship) {
              existing.didInternship++;
            }
          } else {
            acc.push({
              batch: student.batch,
              total: 1,
              didInternship: student.didInternship ? 1 : 0,
              missingInternship: 0, // Will calculate later
            });
          }
          return acc;
        }, [] as { batch: string; total: number; didInternship: number; missingInternship: number }[]);

        // Calculate missing internships
        batchSummary.forEach((item) => {
          item.missingInternship = item.total - item.didInternship;
        });

        setBatches(batchSummary);
        setStudents(filteredByDepartment);
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [DepartmentID]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-semibold text-green-600 mb-8">
          Batch Summary
        </h1>
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">Batch</th>
              <th className="py-2 px-4 text-left">Total Students</th>
              <th className="py-2 px-4 text-left text-green-600">Did Internships</th>
              <th className="py-2 px-4 text-left text-red-600">Missing Internships</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => (
              <tr key={batch.batch} className="border-b border-gray-300">
                <td className="py-2 px-4">{batch.batch}</td>
                <td className="py-2 px-4">{batch.total}</td>
                <td className="py-2 px-4 text-green-600">{batch.didInternship}</td>
                <td className="py-2 px-4 text-red-600">{batch.missingInternship}</td>
                <td className="py-2 px-4">
                  <button
                   
                        onClick={() => handleViewDetails(batch.batch)}
                    
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default BatchSummary;
