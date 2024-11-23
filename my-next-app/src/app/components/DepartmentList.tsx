"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DepartmentDashboard from "@/app/components/departmentForm";

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

const DepartmentList: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/department");
      if (!response.ok) throw new Error("Failed to fetch departments");

      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      setError("Error fetching department information.");
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentClick = (id: string) => {
    router.push(`/Admin/Department/${id}`); // Navigate to department detail page
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-8xl mx-auto w-full">
      <h1 className="text-lg font-semibold mb-6">Departments</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.length === 0 ? (
          <p>No departments available.</p>
        ) : (
          departments.map((dept) => (
            <div
              key={dept._id}
              className="p-4 bg-white border rounded-lg"
            >
              <h2 className="text-green-600 font-semibold text-lg mb-2">
                {dept.name}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-bold">HOD:</span> {dept.honorific} {dept.hodName}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => handleDepartmentClick(dept._id)}
                  className="bg-green-600 text-white px-3 py-1 text-sm rounded shadow-md hover:bg-green-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DepartmentList;
