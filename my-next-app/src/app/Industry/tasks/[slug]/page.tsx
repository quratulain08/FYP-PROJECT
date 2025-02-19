"use client";
import  IndustryLayout from "@/app/Industry/IndustryLayout";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import React, { ChangeEvent } from 'react';



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

interface Submission {
  _id: string;
  studentName: string;
  fileUrl: string;
  grade?: number;
  submittedAt: string;
}


const TaskDetails: React.FC = () => {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const [internship, setInternships] = useState<Internship[]>([]);
  const [student, setStudents] = useState<Student[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const [task, setTask] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskDetails = async () => {
    if (!slug) {
      setError("Task ID not provided.");
      return;
    }
    try {
      const response = await fetch(`/api/task/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch task details");
      const data = await response.json();
      setTask(data);

        // Fetch submissions
      const submissionsResponse = await fetch(`/api/submission/${slug}`);
      if (submissionsResponse.ok) {
        const submissionsData = await submissionsResponse.json();
        console.log("Fetched submissions:", submissionsData); // Debugging log
        setSubmissions(submissionsData);
      } else {
        console.error("Failed to fetch submissions");
      }
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
  
  const handleGradeChange = (submissionId: string, grade: number) => {
    setSubmissions((prevSubmissions) =>
      prevSubmissions.map((submission) =>
        submission._id === submissionId
          ? { ...submission, grade }
          : submission
      )
    );
  };

  const handleSaveGrades = async () => {
    try {
      const updatePromises = submissions.map((submission) =>
        fetch(`/api/submission/${submission._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ grade: submission.grade }),
        })
      );
  
      // Wait for all updates to complete
      const responses = await Promise.all(updatePromises);
      const failedResponses = responses.filter((response) => !response.ok);
  
      if (failedResponses.length > 0) {
        alert("Some grades failed to save. Please try again.");
        return;
      }
  
      alert("Grades saved successfully!");
    } catch (error) {
      console.error("Error saving grades:", error);
      alert("An error occurred while saving grades.");
    }
  };
  

  useEffect(() => {
    fetchTaskDetails();
    FetchAssignedStudent();

  }, [slug]);

  if (error) return <p className="text-center p-6 text-red-500">{error}</p>;
  if (!task) return <p className="text-center p-6">Loading task details...</p>;

  return (
    <IndustryLayout>
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
          {submissions.map((submission, index) => (
            <li key={submission._id} className="p-4 border rounded bg-gray-50 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium"><strong> Student Name : </strong> {submission.studentName}</p>
                  <p><strong> Submitted At:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
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
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleGradeChange(submission._id, parseInt(e.target.value))
                    }
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
    </IndustryLayout>
  );
};

export default TaskDetails;
