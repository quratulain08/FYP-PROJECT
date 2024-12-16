"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const TaskDetails: React.FC = () => {
  const params = useParams();
  const taskId = params?.id as string | undefined;

  const [task, setTask] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskDetails = async () => {
    if (!taskId) {
      setError("Task ID not provided.");
      return;
    }
    try {
      const response = await fetch(`/api/tasks/${taskId}`);
      if (!response.ok) throw new Error("Failed to fetch task details");
      const data = await response.json();
      console.log("Fetched task data:", data); // Debugging
      setTask(data);
    } catch (error) {
      console.error("Error fetching task details:", error);
      setError("Failed to load task details.");
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  if (error) return <p className="text-center p-6 text-red-500">{error}</p>;
  if (!task) return <p className="text-center p-6">Loading task details...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{task.title || "Untitled Task"}</h1>
      <p className="text-gray-600 mb-4">
        {task.description || "No description available."}
      </p>
      <p className="mb-2">
        <strong>Deadline:</strong>{" "}
        {task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline provided."}
      </p>
      <p className="mb-2">
        <strong>Marks:</strong> {task.marks ?? "N/A"}
      </p>
      <p className="mb-2">
        <strong>Weightage:</strong> {task.weightage ?? "N/A"}%
      </p>
    </div>
  );
};

export default TaskDetails;
