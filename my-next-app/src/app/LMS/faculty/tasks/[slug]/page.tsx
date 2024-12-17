"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

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

  const [tasks, setTasks] = useState<Task[]>([]); // List of assigned tasks
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const [task, setTask] = useState<Task>({
    title: "",
    description: "",
    deadline: "",
    time: "",
    marks: 0,
    weightage: 0,
  });

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/taskForFaculty/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data = await response.json();
      setTasks(data); // Set fetched tasks
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle form submission to create a task
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const deadlineWithTime = `${task.deadline}T${task.time || "00:00"}`;

    try {
      const response = await fetch(`/api/taskForFaculty`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, deadline: deadlineWithTime, internshipId: slug }),
      });

      if (!response.ok) throw new Error("Failed to assign task");

      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask.task]); // Add new task to the list
      setTask({ title: "", description: "", deadline: "", time: "", marks: 0, weightage: 0 }); // Clear form
      alert("Task assigned successfully!");
    } catch (error) {
      console.error("Error saving task:", error);
      alert("An error occurred while assigning the task.");
    }
  };

  // Trigger fetchTasks on component load and tab switch
  useEffect(() => {
    fetchTasks();
  }, [slug]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Internship Tasks</h1>

      {/* Loading and Error States */}
      {loading && <p>Loading tasks...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Form to Assign Task */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Task Title"
          className="w-full p-2 border rounded"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Task Description"
          className="w-full p-2 border rounded"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          required
        />
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={task.deadline}
          onChange={(e) => setTask({ ...task, deadline: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Marks"
          className="w-full p-2 border rounded"
          value={task.marks}
          onChange={(e) => setTask({ ...task, marks: parseInt(e.target.value) })}
          required
        />
        <input
          type="number"
          placeholder="Weightage (%)"
          className="w-full p-2 border rounded"
          value={task.weightage}
          onChange={(e) => setTask({ ...task, weightage: parseInt(e.target.value) })}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Assign Task
        </button>
      </form>

      {/* Display Tasks */}
      <h2 className="text-xl font-semibold mt-6">Assigned Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        <ul className="space-y-2 mt-4">
          {tasks.map((t, index) => (
            <li key={t._id} className="p-2 border rounded bg-gray-100">
              <p className="font-medium">
                {index + 1}. {t.title}
              </p>
              <p className="text-sm text-gray-600">Deadline: {new Date(t.deadline).toLocaleString()}</p>
              <p className="text-sm">Marks: {t.marks}, Weightage: {t.weightage}%</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InternshipDetails;
