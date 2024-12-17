"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface Task {
  _id?: string;
  title: string;
  description: string;
  deadline: string;
  marks: number;
  weightage: number;
}

interface Student {
  _id: string;
  name: string;
  email: string;
}

const InternshipDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string | undefined;

  const [tasks, setTasks] = useState<Task[]>([]); // List of assigned tasks
  const [activeTab, setActiveTab] = useState<"internship" | "classwork" | "students">("internship");

  const students: Student[] = [
    { _id: "1", name: "Alice Johnson", email: "alice@example.com" },
    { _id: "2", name: "Bob Smith", email: "bob@example.com" },
    { _id: "3", name: "Charlie Brown", email: "charlie@example.com" },
  ];

  // Fetch tasks from the industry
  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?internshipId=${slug}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Handle task click for details
  const handleTaskClick = (taskId: string) => {
    router.push(`/LMS/student/tasksubmission/${taskId}`);
  };

  useEffect(() => {
    if (activeTab === "internship" && slug) {
      fetchTasks();
    }
  }, [activeTab, slug]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Tabs Navigation */}
      <div className="flex justify-between border-b mb-6">
        <button
          onClick={() => setActiveTab("internship")}
          className={`py-2 px-4 ${activeTab === "internship" ? "border-b-2 border-blue-500 font-bold" : ""}`}
        >
          Tasks from Industry supervisor
        </button>
        <button
          onClick={() => setActiveTab("classwork")}
          className={`py-2 px-4 ${activeTab === "classwork" ? "border-b-2 border-blue-500 font-bold" : ""}`}
        >
          Tasks from Faculty supervisor
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`py-2 px-4 ${activeTab === "students" ? "border-b-2 border-blue-500 font-bold" : ""}`}
        >
          Submitted Tasks
        </button>
      </div>

      {/* Internship Tab */}
      {activeTab === "internship" && (
        <div className="border p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Tasks Assigned by Industry</h2>
          {tasks.length === 0 ? (
            <p>No tasks assigned yet.</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task, index) => (
                <li
                  key={task._id}
                  onClick={() => handleTaskClick(task._id!)}
                  className="p-4 border rounded bg-gray-50 shadow-sm hover:bg-gray-100 cursor-pointer"
                >
                  <p className="font-medium text-blue-600 hover:underline">Task {index + 1}</p>
                  <p className="text-sm text-gray-500">
                    Deadline: {new Date(task.deadline).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Classwork Tab */}
      {activeTab === "classwork" && (
        <div className="border p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Classwork</h2>
          <p>Classwork functionality can be added here.</p>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === "students" && (
        <div className="border p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Enrolled Students</h2>
          {students.length === 0 ? (
            <p>No students are enrolled in this internship.</p>
          ) : (
            <ul className="space-y-2">
              {students.map((student) => (
                <li key={student._id} className="p-2 border rounded bg-gray-50 shadow-sm">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default InternshipDetails;
