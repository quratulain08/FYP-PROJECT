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
import InterpriseCellLayout from "./../InterpriseCellLayout"

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
  isApproved: boolean;
}

const ApprovalDashboard: React.FC = () => {
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

  // Calculate Approval Stats
  const pendingApproval = internships.filter((i) => !i.isApproved).length;
  const approved = internships.filter((i) => i.isApproved).length;

  // Data for Pie Chart (Approval Status)
  const approvalData = {
    labels: ["Pending Approval", "Approved"],
    datasets: [
      {
        data: [pendingApproval, approved],
        backgroundColor: ["#f44336", "#4caf50"],
        hoverBackgroundColor: ["#d32f2f", "#388e3c"],
      },
    ],
  };

  // Data for Bar Chart (Internships by Category with Approval Status)
  const categories = Array.from(new Set(internships.map((i) => i.category)));
  const categoryApprovalCounts = categories.map((category) => {
    const total = internships.filter((i) => i.category === category).length;
    const approvedCount = internships.filter(
      (i) => i.category === category && i.isApproved
    ).length;
    const pendingCount = total - approvedCount;
    return { category, approvedCount, pendingCount };
  });

  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Approved",
        data: categoryApprovalCounts.map((c) => c.approvedCount),
        backgroundColor: "#4caf50",
      },
      {
        label: "Pending Approval",
        data: categoryApprovalCounts.map((c) => c.pendingCount),
        backgroundColor: "#f44336",
      },
    ],
  };

  return (
    <InterpriseCellLayout>
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-green-600 mb-6">
        Internship Approval Dashboard
      </h1>

      {/* Pending Approval Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-green-600 mb-4">
          Approval Summary
        </h2>
        <p className="text-gray-700">
          <strong>Internships Pending Approval:</strong> {pendingApproval}
        </p>
        <p className="text-gray-700">
          <strong>Approved Internships:</strong> {approved}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-green-600 mb-4">
            Approval Status
          </h2>
          <Pie data={approvalData} />
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-green-600 mb-4">
            Internships by Category and Approval Status
          </h2>
          <Bar data={barData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
    </InterpriseCellLayout>
  );
};

export default ApprovalDashboard;