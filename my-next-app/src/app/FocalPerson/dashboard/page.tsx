"use client";

import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import FocalPersonLayout from "../FocalPersonLayout";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface Internship {
  _id: string;
  title: string;
  hostInstitution: string;
  location: string;
  category: string;
  startDate: string;
  endDate: string;
  description: string;
  assignedFaculty: string[];
  assignedStudents: string[];
}

const Dashboard: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await fetch("/api/internships");
        if (!res.ok) throw new Error("Failed to fetch internships");
        const data: Internship[] = await res.json();
        setInternships(data);
      } catch (err) {
        setError("Error fetching internships");
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Calculate Missing Assignments
  const missingStudents = internships.filter((i) => i.assignedStudents.length === 0).length;
  const missingFaculty = internships.filter((i) => i.assignedFaculty.length === 0).length;

  // Data for Pie Chart (Assigned Students vs Faculty)
  const studentFacultyCounts = internships.reduce(
    (acc, i) => {
      acc.students += i.assignedStudents.length;
      acc.faculty += i.assignedFaculty.length;
      return acc;
    },
    { students: 0, faculty: 0 }
  );

  const pieData = {
    labels: ["Assigned Students", "Assigned Faculty"],
    datasets: [
      {
        data: [studentFacultyCounts.students, studentFacultyCounts.faculty],
        backgroundColor: ["#2196f3", "#ff5722"],
        hoverBackgroundColor: ["#1976d2", "#e64a19"],
      },
    ],
  };

  // Data for Bar Chart (Internships by Category)
  const categories = Array.from(new Set(internships.map((i) => i.category)));
  const categoryCounts = categories.map(
    (category) => internships.filter((i) => i.category === category).length
  );

  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Internships by Category",
        data: categoryCounts,
        backgroundColor: "#ff9800",
        borderColor: "#f57c00",
        borderWidth: 1,
      },
    ],
  };

  return (
    <FocalPersonLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-semibold text-green-600 mb-6">Internship Dashboard</h1>

        {/* Missing Data Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-green-600 mb-4">Missing Assignments</h2>
          <p className="text-gray-700">
            <strong>Internships Missing Students:</strong> {missingStudents}
          </p>
          <p className="text-gray-700">
            <strong>Internships Missing Faculty:</strong> {missingFaculty}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-green-600 mb-4">
              Assigned Students vs Faculty
            </h2>
            <Pie data={pieData} />
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-green-600 mb-4">
              Internships by Category
            </h2>
            <Bar data={barData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
      </FocalPersonLayout>
  );
};

export default Dashboard;
