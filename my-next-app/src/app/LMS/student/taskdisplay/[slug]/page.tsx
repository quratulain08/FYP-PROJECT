"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface IndustryTask {
  _id?: string;
  title: string;
  description: string;
  deadline: string;
  marks: number;
  weightage: number;
}

interface FacultyTask {
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

  const [tasks, setTasks] = useState<IndustryTask[]>([]); // List of assigned tasks
  const [tasks2, setTasks2] = useState<FacultyTask[]>([]); // List of assigned tasks

  const [activeTab, setActiveTab] = useState<"internship" | "classwork" | "students">("internship");

  const students: Student[] = [
    { _id: "1", name: "Alice Johnson", email: "alice@example.com" },
    { _id: "2", name: "Bob Smith", email: "bob@example.com" },
    { _id: "3", name: "Charlie Brown", email: "charlie@example.com" },
  ];

  const fetchTasks = async () => {
    try {
      const responseIndustry = await fetch(`/api/tasksForIndustry/${slug}`);
      if (!responseIndustry.ok) throw new Error("Failed to fetch industry tasks");
  
      const dataIndustry = await responseIndustry.json();
      setTasks(dataIndustry); // Set tasks for the industry supervisor
  
      const responseFaculty = await fetch(`/api/taskForFaculty/${slug}`);
      if (!responseFaculty.ok) throw new Error("Failed to fetch faculty tasks");
  
      const dataFaculty = await responseFaculty.json();
      setTasks2(dataFaculty); // Set tasks for the faculty supervisor
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  
  // Handle task click for details
  const handleTaskClickIndustry = (taskId: string) => {
    router.push(`/LMS/student/tasksubmissionIndustry/${taskId}`);
  };

  const handleTaskClickFaculty = (taskId: string) => {
    router.push(`/LMS/student/tasksubmissionFaculty/${taskId}`);
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
                  onClick={() => handleTaskClickIndustry(task._id!)}
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

      {/* Faculty Tab */}
{activeTab === "classwork" && (
  <div className="border p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Tasks Assigned by Faculty</h2>
    {tasks2.length === 0 ? (
      <p>No tasks assigned yet.</p>
    ) : (
      <ul className="space-y-2">
        {tasks2.map((task, index) => (
          <li
            key={task._id}
            onClick={() => handleTaskClickFaculty(task._id!)}
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
