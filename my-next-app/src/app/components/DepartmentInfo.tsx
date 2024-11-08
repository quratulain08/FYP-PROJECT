"use client";

import { FaEdit, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Department {
  _id: string;  // Changed from 'id' to '_id' to match MongoDB
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

const DepartmentInfo: React.FC = () => {
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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        const response = await fetch(`/api/department/${id}`, {  // Updated to use URL parameter
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
          // Removed body since we're using URL parameter
        });
    
        const result = await response.json();
    
        if (response.ok) {
          alert(result.message);
          fetchDepartments();
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error('Error deleting department:', error);
        alert('Failed to delete department.');
      }
    }
  };

  const handleEdit = (department: Department) => {
    localStorage.setItem('editingDepartment', JSON.stringify(department));
    router.push('/DepartmentForm');
  };

  const handleAddNewDepartment = () => {
    localStorage.removeItem('editingDepartment');
    router.push('/DepartmentForm');
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-xl">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-red-600 text-xl">{error}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Departments</h1>
        <button
          onClick={handleAddNewDepartment}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300"
        >
          Add New Department
        </button>
      </div>

      {departments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No departments available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition duration-300"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl text-green-600 font-semibold mb-4">
                  {dept.honorific} {dept.hodName} - {dept.name}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(dept)}
                    className="text-yellow-500 hover:text-yellow-600 p-2"
                    title="Edit"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(dept._id)}
                    className="text-red-500 hover:text-red-600 p-2"
                    title="Delete"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div key={`${dept._id}-details-1`}>
                  <p><span className="font-semibold">Category:</span> {dept.category}</p>
                  <p><span className="font-semibold">Start Date:</span> {dept.startDate}</p>
                  <p><span className="font-semibold">CNIC:</span> {dept.cnic}</p>
                  <p><span className="font-semibold">Email:</span> {dept.email}</p>
                </div>
                <div key={`${dept._id}-details-2`}>
                  <p><span className="font-semibold">Phone:</span> {dept.phone}</p>
                  {dept.landLine && (
                    <p><span className="font-semibold">Land Line:</span> {dept.landLine}</p>
                  )}
                  <p><span className="font-semibold">Address:</span> {dept.address}</p>
                  <p><span className="font-semibold">Location:</span> {dept.city}, {dept.province}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentInfo;