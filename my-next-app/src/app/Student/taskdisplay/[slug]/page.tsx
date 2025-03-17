"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import StudentLayout from "@/app/Student/StudentLayout";

interface IndustryTask {
  _id?: string;
  title: string;
  description: string;
  deadline: string;
  marks: number;
  weightage: number;
  assignedStudents:string[];
}

interface FacultyTask {
  _id?: string;
  title: string;
  description: string;
  deadline: string;
  marks: number;
  weightage: number;
  assignedStudents:string[];
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
  const router = useRouter();
  const slug = params?.slug as string | undefined;
  const [internship, setInternships] = useState<Internship[]>([]);
  const [student, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<IndustryTask[]>([]); // List of assigned tasks
  const [tasks2, setTasks2] = useState<FacultyTask[]>([]); // List of assigned tasks
  const [loading, setLoading] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<"internship" | "classwork" | "students">("internship");

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


  // Handle task click for details
  const handleTaskClick = (taskId: string) => {
    router.push(`/Student/tasksubmission/${taskId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const email = "ammar33@gmail.com"; // Replace with actual logic to get the email

      setLoading(true); // Set loading to true before fetching data
      try {
       // Fetch student data by email
      const responsee = await fetch(`/api/StudentByemail/${email}`);
      if (!responsee.ok) throw new Error("Failed to fetch student details");
  
      const dataa = await responsee.json();
      setStudents(dataa);
  
      if (dataa.length === 0) {
        throw new Error("No students found with the provided email");
      }
  
      const adminid = dataa._id; // // Assuming you want the first student in the array
        setAdminId(adminid); // Set the adminId state

        // Fetch tasks and assigned students if activeTab and slug are valid
        if (activeTab === "internship" && slug) {
          await fetchTasks();
          await FetchAssignedStudent();
        }
      } catch (err: unknown) {
        console.log(err);
        setError("Error fetching internships.");
      } finally {
        setLoading(false); // Ensure loading is stopped in all cases
      }
    };

    fetchData(); // Call the async function
  }, [activeTab, slug]); // Dependencies

  return (
    <StudentLayout>
    <div className="max-w-4xl mx-auto p-6">
      {/* Tabs Navigation */}
      <div className="flex justify-between border-b mb-6">
        <button
          onClick={() => setActiveTab("internship")}
          className={`py-2 px-4 ${activeTab === "internship" ? "border-b-2 border-green-500 text-green-600 font-bold" : ""}`}
        >
          Tasks from Industry supervisor
        </button>
        <button
          onClick={() => setActiveTab("classwork")}
          className={`py-2 px-4 ${activeTab === "classwork" ? "border-b-2 border-green-500 text-green-600 font-bold" : ""}`}
        >
          Tasks from Faculty supervisor
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`py-2 px-4 ${activeTab === "students" ? "border-b-2 border-green-500 text-green-600 font-bold" : ""}`}
        >
          Other Students Enrolled
        </button>
      </div>

      {/* Internship Tab */}
      {activeTab === "internship" && (
        <div className="border p-6 rounded-lg shadow-md">
          <h2 className="text-2xl  text-green-600  font-semibold mb-4">Tasks Assigned by Industry</h2>
          {tasks.length === 0 ? (
            <p>No tasks assigned yet.</p>
          ) : (
            <ul className="space-y-2">
              {tasks
              .filter(task => task.assignedStudents.includes(adminId!)) // Filter tasks based on studentId
              .map((task, index) => (
                <li
                  key={task._id}
                  onClick={() => handleTaskClick(task._id!)}
                  className="p-4 border rounded bg-gray-50 shadow-sm hover:bg-gray-100 cursor-pointer"
                >
                  <p className="font-medium text-green-600 hover:underline">Task {index + 1}</p>
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
  <div className="border p-6  rounded-lg shadow-md">
    <h2 className="text-2xl border-green-500 text-green-600 font-semibold mb-4">Tasks Assigned by Faculty</h2>
    {tasks2.length === 0 ? (
      <p>No tasks assigned yet.</p>
    ) : (
      <ul className="space-y-2">
        {tasks2
      .filter(tasks2 => tasks2.assignedStudents.includes(adminId!)) // Filter tasks based on studentId
       .map((task, index) => (
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


      {/* Students Tab */}
      {activeTab === "students" && (
        <div className="border p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold  text-green-600 mb-4">Other Students</h2>
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
    </StudentLayout>
  );
};

export default InternshipDetails;
