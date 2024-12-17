"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface SubmittedTask {
  _id: string;
  studentName: string;
  fileUrl: string;
  grade: number | null;
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


const TaskDetails: React.FC = () => {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const [internship, setInternships] = useState<Internship[]>([]);
  const [student, setStudents] = useState<Student[]>([]);

  const [task, setTask] = useState<any>(null);
  const [submissions, setSubmissions] = useState<SubmittedTask[]>([]); // Mock student submissions
  const [error, setError] = useState<string | null>(null);

  const fetchTaskDetails = async () => {
    if (!slug) {
      setError("Task ID not provided.");
      return;
    }
    try {
      const response = await fetch(`/api/tasksForIndustry/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch task details");
      const data = await response.json();
      setTask(data);

      // Mock student submissions
      const mockSubmissions: SubmittedTask[] = [
        { _id: "1", studentName: "Alice Johnson", fileUrl: "https://example.com/file1.pdf", grade: null },
        { _id: "2", studentName: "Bob Smith", fileUrl: "https://example.com/file2.docx", grade: null },
        { _id: "3", studentName: "Charlie Brown", fileUrl: "https://example.com/file3.zip", grade: null },
      ];
      setSubmissions(mockSubmissions);
    } catch (error) {
      console.error("Error fetching task details:", error);
      setError("Failed to load task details.");
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
  
  const handleGradeChange = (id: string, grade: number) => {
    setSubmissions((prevSubmissions) =>
      prevSubmissions.map((submission) =>
        submission._id === id ? { ...submission, grade } : submission
      )
    );
  };

  const handleSaveGrades = () => {
    // Save grades to the backend
    console.log("Grades saved:", submissions);
    alert("Grades saved successfully!");
  };

  useEffect(() => {
    fetchTaskDetails();
    FetchAssignedStudent();

  }, [slug]);

  if (error) return <p className="text-center p-6 text-red-500">{error}</p>;
  if (!task) return <p className="text-center p-6">Loading task details...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{task.title || "Untitled Task"}</h1>
      <p className="text-gray-600 mb-4">{task.description || "No description available."}</p>
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

      {/* Submissions Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Student Submissions</h2>
        {submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <ul className="space-y-4">
            {submissions.map((submission) => (
              <li
                key={submission._id}
                className="p-4 border rounded bg-gray-50 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{submission.studentName}</p>
                    <a
                      href={submission.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Submission
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max={task.marks}
                      placeholder="Assign Grade"
                      value={submission.grade || ""}
                      onChange={(e) => handleGradeChange(submission._id, parseInt(e.target.value))}
                      className="w-24 p-2 border rounded"
                    />
                    <span>/ {task.marks}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {submissions.length > 0 && (
          <button
            onClick={handleSaveGrades}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Grades
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
