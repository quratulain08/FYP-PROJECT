"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Task {
  _id?: string;
  title: string;
  description: string;
  deadline: string;
  time?: string;
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

  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "classwork" | "students">("dashboard");
  const [task, setTask] = useState<Task>({
    title: "",
    description: "",
    deadline: "",
    time: "",
    marks: 0,
    weightage: 0,
  });

  const students: Student[] = [
    { _id: "1", name: "Alice Johnson", email: "alice@example.com" },
    { _id: "2", name: "Bob Smith", email: "bob@example.com" },
    { _id: "3", name: "Charlie Brown", email: "charlie@example.com" },
  ];

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?internshipId=${slug}&createdBy=industry`);
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task.title || !task.description || !task.deadline) {
      alert("Title, description, and deadline are required.");
      return;
    }

    const deadlineWithTime = `${task.deadline}T${task.time || "00:00"}`;

    try {
      const response = await fetch(`/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, deadline: deadlineWithTime, internshipId: slug }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, newTask.task]);
        setTask({ title: "", description: "", deadline: "", time: "", marks: 0, weightage: 0 });
        alert("Task assigned successfully!");
      } else {
        const { error } = await response.json();
        alert(`Failed to assign task: ${error}`);
      }
    } catch (error) {
      console.error("Error saving task:", error);
      alert("An error occurred while assigning the task.");
    }
  };

  const handleTaskClick = (taskId: string) => {
    router.push(`/LMS/industry/tasks/${taskId}`);
  };

  useEffect(() => {
    if (activeTab === "classwork" && slug) {
      fetchTasks();
    }
  }, [activeTab, slug]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Tabs Navigation */}
      <div className="flex justify-between border-b mb-6">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`py-2 px-4 ${activeTab === "dashboard" ? "border-b-2 text-green-600 font-semibold  text-green-600" : "text-gray-600"}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("classwork")}
          className={`py-2 px-4 ${activeTab === "classwork" ? "border-b-2 border-green-600 font-semibold text-green-600" : "text-gray-600"}`}
        >
          Classwork
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`py-2 px-4 ${activeTab === "students" ? "border-b-2 border-green-600 font-semibold text-green-600" : "text-gray-600"}`}
        >
          Students
        </button>
      </div>

      {/* Dashboard: Assign Tasks */}
      {activeTab === "dashboard" && (
        <div className="border border-gray-300 p-6 rounded-lg shadow-lg bg-white mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Assign Task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Task Title</label>
              <textarea
                className="w-full border border-gray-300 p-2 rounded-lg"
                rows={2}
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block font-medium">Task Description</label>
              <textarea
                className="w-full border border-gray-300 p-2 rounded-lg"
                rows={4}
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Deadline (Date)</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  value={task.deadline}
                  onChange={(e) => setTask({ ...task, deadline: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Deadline (Time)</label>
                <input
                  type="time"
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  value={task.time || ""}
                  onChange={(e) => setTask({ ...task, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Marks</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  value={task.marks}
                  onChange={(e) => setTask({ ...task, marks: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Weightage (%)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  value={task.weightage}
                  onChange={(e) => setTask({ ...task, weightage: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Assign Task
            </button>
          </form>
        </div>
      )}

      {/* Classwork: Display Tasks */}
      {activeTab === "classwork" && (
        <div className="border border-gray-300 p-6 rounded-lg shadow-lg bg-white mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Assigned Tasks</h2>
          {tasks.length === 0 ? (
            <p>No tasks assigned yet.</p>
          ) : (
            <ul className="space-y-4">
              {tasks.map((task, index) => (
                <li
                  key={task._id}
                  onClick={() => handleTaskClick(task._id!)}
                  className="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 cursor-pointer transition duration-300"
                >
                  <p className="font-semibold text-blue-600 hover:underline">Task {index + 1}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Students: Display Enrolled Students */}
      {activeTab === "students" && (
        <div className="border border-gray-300 p-6 rounded-lg shadow-lg bg-white mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Enrolled Students</h2>
          {students.length === 0 ? (
            <p>No students are enrolled in this internship.</p>
          ) : (
            <ul className="space-y-4">
              {students.map((student) => (
                <li key={student._id} className="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50">
                  <p className="font-semibold">{student.name}</p>
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
