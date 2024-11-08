"use client";

import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface StudentData {
  name: string;
  department: string;
  batch: string;
  didInternship: boolean;
}

const StudentDashboard: React.FC = () => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/students");
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    fetchStudents();
  }, []);

  // Filter logic based on selected department and batch
  const filteredStudents = students.filter(
    (student) =>
      (selectedDepartment ? student.department === selectedDepartment : true) &&
      (selectedBatch ? student.batch === selectedBatch : true)
  );

  // Get statistics for graphs
  const totalStudents = filteredStudents.length;
  const studentsWithInternships = filteredStudents.filter(
    (student) => student.didInternship
  ).length;

  const departmentCounts = filteredStudents.reduce<Record<string, number>>(
    (acc, student) => {
      acc[student.department] = (acc[student.department] || 0) + 1;
      return acc;
    },
    {}
  );

  // Data for Bar Chart (Department-wise breakdown)
  const barChartData = {
    labels: Object.keys(departmentCounts),
    datasets: [
      {
        label: "Students per Department",
        data: Object.values(departmentCounts),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Data for Pie Chart (Internships vs. No Internships)
  const pieChartData = {
    labels: ["With Internship", "Without Internship"],
    datasets: [
      {
        data: [studentsWithInternships, totalStudents - studentsWithInternships],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Student Dashboard</h1>

      <div className="mb-6 flex gap-4">
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Electrical Engineering">Electrical Engineering</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
        </select>

        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Batches</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-xl font-bold mb-4">Department-wise Breakdown</h2>
          <Bar data={barChartData} />
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-xl font-bold mb-4">Internship Status</h2>
          <Pie data={pieChartData} />
          <p className="text-center mt-4 text-lg font-semibold">
            Total Students: {totalStudents}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
