"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  focalPersonName: string;
  focalPersonHonorific: string;
  focalPersonCnic: string;
  focalPersonEmail: string;
  focalPersonPhone: string;
}

const DepartmentListInStudents: React.FC = () => {
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
    router.push(`/admin/Batch/${id}`);
  };

  // Function to get initials from department name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto w-full p-6">
      <h3 className="text-1xl mb-4">Click on Department to view details</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {departments.length === 0 ? (
          <p>No departments available.</p>
        ) : (
          departments.map((dept) => (
            <div
              key={dept._id}
              className="bg-white rounded-lg shadow-md p-6 relative transition-all duration-300 border border-transparent hover:border-green-500 hover:shadow-lg"
            >
              <div
                onClick={() => handleDepartmentClick(dept._id)}
                className="flex flex-col items-center cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleDepartmentClick(dept._id);
                  }
                }}
              >
                <div className="w-24 h-24 rounded-full bg-green-400 flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-105">
                  <span className="text-white text-2xl font-bold">
                    {getInitials(dept.name)}
                  </span>
                </div>
                <h2 className="text-center font-bold text-gray-800 mb-1">
                  {dept.name}
                </h2>
                <p className="text-center text-sm text-gray-600">
                  {dept.honorific} {dept.hodName}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DepartmentListInStudents;
