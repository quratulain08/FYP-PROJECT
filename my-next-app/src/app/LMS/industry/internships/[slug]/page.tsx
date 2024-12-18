"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import  IndustryLayout from "@/app/Industry/IndustryLayout";

interface Task {
  _id?: string;
  title: string;
  description: string;
  deadline: string;
  time?: string;
  marks: number;
  createdby:string;
  weightage: number;
}

interface Internship {
  _id: string;
  title: string;
  hostInstitution: string;
  location: string;
  category: string;
  startDate: string;
  endDate: string;
  description: string;
  assignedFaculty: string;
  assignedStudents: string;
}
interface Student {
  _id: string;
  name: string;
  department: string;
  batch: string;
  didInternship: boolean;
  registrationNumber: string;
  section: string;
  email: string;
}


const InternshipDetails: React.FC = () => {
  const params = useParams();
  const [internship, setInternships] = useState<Internship[]>([]);
  const [student, setStudents] = useState<Student[]>([]);

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
    createdby: "",
  });



  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasksForIndustry/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data = await response.json();
      setTasks(data);
      
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const FetchAssignedStudent = async () => {
    try {
      const response = await fetch(`/api/internships/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch internship");
  
      const data = await response.json();
      setInternships(data);
  
      // Ensure that assignedStudents is an array of strings (student IDs)
      const assignedStudents: string[] = data.assignedStudents; // or number[] depending on your data structure
  
      if (assignedStudents && assignedStudents.length > 0) {
        // Fetch the students assigned to this internship
        await FetchStudentfinal(assignedStudents);
      } else {
        console.log("No students assigned to this internship");
      }
  
    } catch (error) {
      console.error("Error fetching internship:", error);
    }
  };
  
  // Update FetchStudentfinal to use the correct type for assignedStudents
  const FetchStudentfinal = async (assignedStudents: string[]) => {
    try {
      // Fetch student data for each student in the assignedStudents array
      const studentPromises = assignedStudents.map(async (studentId) => {
        const response = await fetch(`/api/students/${studentId}`);
        if (!response.ok) throw new Error(`Failed to fetch student with ID ${studentId}`);
  
        const data: Student = await response.json();
        return data;
      });
  
      // Wait for all student data to be fetched
      const studentsData = await Promise.all(studentPromises);
      setStudents(studentsData);
  
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  

  // Handle task form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task.title || !task.description || !task.deadline) {
      alert("Title, description, and deadline are required.");
      return;
    }

    const deadlineWithTime = `${task.deadline}T${task.time || "00:00"}`;

    console.log("Submitting task:", {
      ...task,
      deadline: deadlineWithTime,
      internshipId: slug,
    });

    try {
      const response = await fetch(`/api/tasksForIndustry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, deadline: deadlineWithTime, internshipId: slug  }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, newTask.task]);
        setTask({ title: "", description: "", deadline: "", time: "", marks: 0, weightage: 0 ,createdby:''});
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
      FetchAssignedStudent();
      
    }
  }, [activeTab, slug]);

  return (
    <IndustryLayout>
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
              className="bg-green-600  text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
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
        <div className="border p-6 rounded-lg shadow-md">
          <h2 className="text-2xl text-green-600 font-semibold mb-4">Enrolled Students</h2>
          {student.length === 0 ? (
            <p>No students are enrolled in this internship.</p>
          ) : (
            <ul className="space-y-2">
              {student.map((student) => (
  <li key={student._id} className="p-2 border rounded bg-gray-50 shadow-sm">
    <p className="font-medium"><strong>{student.name}</strong></p>
    <p className="text-sm text-gray-500"><strong>Department:</strong> {student.department}</p>
    <p className="text-sm text-gray-500"><strong>Batch:</strong> {student.batch}</p>
    <p className="text-sm text-gray-500"><strong>Section:</strong> {student.section}</p>
    <p className="text-sm text-gray-500"><strong>Did Internship:</strong> {student.didInternship ? 'Yes' : 'No'}</p>
    <p className="text-sm text-gray-500"><strong>Registration Number:</strong> {student.registrationNumber}</p>
    <p className="text-sm text-gray-500"><strong>Email:</strong> {student.email}</p>
  </li>
))}

            </ul>
          )}
        </div>
      )}
    </div>
    </IndustryLayout>
  );
};

export default InternshipDetails;
