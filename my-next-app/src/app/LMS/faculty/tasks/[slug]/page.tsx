"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import  FacultyLayout from "@/app/FacultySupervisor/FacultyLayout";

interface Task {
  _id?: string;
  title: string;
  description: string;
  deadline: string;
  time?: string;
  marks: number;
  weightage: number;
}

const InternshipDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [task, setTask] = useState<Task | null>(null); // Single task object
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const [newTask, setNewTask] = useState<Task>({
    title: "",
    description: "",
    deadline: "",
    time: "",
    marks: 0,
    weightage: 0,
  });

  // Fetch task from API
  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/task/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch task");

      const data = await response.json();
      setTask(data); // Set fetched task
    } catch (error) {
      console.error("Error fetching task:", error);
      setError("Failed to load task. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle form submission to create a task
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const deadlineWithTime = `${newTask.deadline}T${newTask.time || "00:00"}`;

    try {
      const response = await fetch(`/api/taskForFaculty`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTask, deadline: deadlineWithTime, internshipId: slug }),
      });

      if (!response.ok) throw new Error("Failed to assign task");

      const createdTask = await response.json();
      setTask(createdTask.task); // Set the newly created task
      setNewTask({ title: "", description: "", deadline: "", time: "", marks: 0, weightage: 0 }); // Clear form
      alert("Task assigned successfully!");
    } catch (error) {
      console.error("Error saving task:", error);
      alert("An error occurred while assigning the task.");
    }
  };

  // Trigger fetchTask on component load and tab switch
  useEffect(() => {
    fetchTask();
  }, [slug]);

  return (
    <FacultyLayout>
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Internship Tasks</h1>

      {/* Loading and Error States */}
      {loading && <p>Loading task...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Form to Assign Task */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Task Title"
          className="w-full p-2 border rounded"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Task Description"
          className="w-full p-2 border rounded"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          required
        />
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Marks"
          className="w-full p-2 border rounded"
          value={newTask.marks}
          onChange={(e) => setNewTask({ ...newTask, marks: parseInt(e.target.value) })}
          required
        />
        <input
          type="number"
          placeholder="Weightage (%)"
          className="w-full p-2 border rounded"
          value={newTask.weightage}
          onChange={(e) => setNewTask({ ...newTask, weightage: parseInt(e.target.value) })}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Assign Task
        </button>
      </form>

      {/* Display Task */}
      <h2 className="text-xl font-semibold mt-6">Assigned Task</h2>
      {task ? (
        <div className="p-2 border rounded bg-gray-100 mt-4">
          <p className="font-medium">{task.title}</p>
          <p className="text-sm text-gray-600">
            Deadline: {new Date(task.deadline).toLocaleString()}
          </p>
          <p className="text-sm">Marks: {task.marks}, Weightage: {task.weightage}%</p>
          <p className="mt-2">{task.description}</p>
        </div>
      ) : (
        <p>No task assigned yet.</p>
      )}
    </div>
    </FacultyLayout>
  );
};

export default InternshipDetails;
