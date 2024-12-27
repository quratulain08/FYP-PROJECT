"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import StudentLayout from "@/app/Student/StudentLayout";
import Student from "@/models/student";


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
  submittedAt: string;
}

const TaskSubmission: React.FC = () => {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [task, setTask] = useState<any>(null);
  const [student, setStudent] = useState<Student | null>(null); // Update to hold a single student
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);


  const fetchTaskDetails = async () => {
    if (!slug) {
      setError("Task ID not provided.");
      return;
    }

    try {
      const response = await fetch(`/api/task/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch task details");

      const data = await response.json();
      console.log("Fetched task details:", data);
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

  const FetchStudentDetails = async () => {
    const email = "ammary9290111@gmail.com"; // Replace with actual logic to get the email
  
    try {
      // Fetch student data by email
      const responsee = await fetch(`/api/StudentByemail/${email}`);
      if (!responsee.ok) throw new Error("Failed to fetch student details");
  
      const dataa: Student = await responsee.json(); // Assume the API returns a single student object
      setStudent(dataa);
  
      if (!dataa) {
        throw new Error("No student found with the provided email");
      }
    } catch (err: unknown) {
      console.error("Error fetching student:", err);
      setError("Error fetching student.");
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  };
  
  const handleCommentSubmit = async () => {
    // if (!comment) {
    //   alert("Please enter a comment before submitting.");
    //   return;
    // }

    // try {
    //   const response = await fetch(`/api/task/${slug}/comments`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       commenterName: student?.name, // Get student name dynamically
    //       content: comment,
    //       commentCreatedAt: new Date(),
    //     }),
    //   });

    //   if (response.ok) {
    //     const data = await response.json();
    //     alert("Comment submitted successfully.");
    //     setComment(""); // Clear the comment field
    //     fetchTaskDetails(); // Refresh task details with new comments
    //   } else {
    //     alert("Failed to submit comment.");
    //   }
    // } catch (error) {
    //   console.error("Error submitting comment:", error);
    //   alert("Error submitting comment.");
    // }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("pdfStudent", file); // The key here must match the backend's expected field name

    try {
      const res = await fetch("/api/upload-PDFs", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload");
      }
      // Assuming the response contains a fileUrl or fileId, we pass it to handleSubmitFile
      handleSubmitFile(data.fileUrl || data.fileId); // Pass the correct file identifier here

      setMessage(`File uploaded successfully: ${data.fileUrl}`);
    } catch (error: any) {
      setMessage(error.message || "Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitFile = async (fileId: string) => {
    try {
      if (!fileId) {
        alert("Please select a file to upload.");
        return;
      }

      if (!slug) {
        alert("Task ID is missing.");
        return;
      }
      if (!student) {
        alert("No student details available.");
        return;
      }

      // Prepare FormData
      const formData = new FormData();
      formData.append("file", fileId); // Pass fileId instead of fileUrl here
      formData.append("studentName", student.name); // Replace with dynamic student name

      // Debugging logs
      console.log("Submitting file:", fileId);
      console.log("Task ID:", slug);

      // Make the API call
      const response = await fetch(`/api/submission/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId: fileId, // Now sending "file" instead of "fileId"
          studentName: student.name,
          studentId: student._id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("submission done successfully:", data);

        alert("submission done successfully!");
        setUploadedFile(null); // Clear file input
        fetchTaskDetails(); // Refresh submissions
      } else {
        const errorData = await response.json();
        console.error("Error while submission:", errorData);
        alert(`Failed to record submit : ${errorData.error}`);
      }
    } catch (error) {
      console.log("Unexpected error during submission:", error);
      alert("An unexpected error occurred during the submissionn.");
    }
  };

  useEffect(() => {
    FetchStudentDetails();
    fetchTaskDetails();
 
  }, [slug]);

  if (error) return <p className="text-center p-6 text-red-500">{error}</p>;
  if (!task) return <p className="text-center p-6">Loading task details...</p>;

  return (
    <StudentLayout>
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-green-600">{task.title || "Untitled Task"}</h1>
      <p className="text-gray-700 mb-4">{task.description || "No description available."}</p>
      <p className="mb-2">
        <strong>Deadline:</strong> {task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline provided."}
      </p>
      <p className="mb-2">
        <strong>Marks:</strong> {task.marks ?? "N/A"}
      </p>
      <p className="mb-2">
        <strong>Weightage:</strong> {task.weightage ?? "N/A"}%
      </p>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Submit Your Task</h2>
        <div className="space-y-4">
          <input
            type="file"
            name="pdfStudent"
            onChange={handleFileChange}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleUpload}
            className={`${
              uploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white px-4 py-2 rounded`}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        {submissionStatus && (
          <p className="mt-4 text-center text-green-600 font-medium">{submissionStatus}</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Submissions</h2>
        {submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <ul className="space-y-4">
            {submissions.map((submission, index) => (
              <li key={submission._id} className="p-4 border rounded bg-gray-50 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium"><strong>Submission {index + 1}</strong></p>
                    <p><strong>By:</strong>  { submission.studentName}</p>
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
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* <div className="flex mt-8">
        {/* Commenting box */}
        {/* <div className="w-1/3 ml-8 p-6 bg-gray-100 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add a Comment</h2>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            rows={4}
            className="w-full p-2 border rounded-lg mb-4"
            placeholder="Write your comment..."
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit Comment
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div> */}

        {/* View all comments */}
        {/* <div className="w-2/3 ml-8 p-6 bg-gray-100 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">All Comments</h2>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <ul>
              {comments.map((comment, index) => (
                <li key={index} className="mb-4 p-4 border-b">
                  <p className="text-gray-700">{comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div> */}
      {/* </div> */} 
    
    </div>
  </StudentLayout>
);
};

  


export default TaskSubmission;
